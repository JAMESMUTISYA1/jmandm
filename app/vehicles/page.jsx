"use client";
import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { collection, getDocs, query, limit, startAfter, where } from 'firebase/firestore';
import { db } from '../../Shared/Firebaseconfig'; // Adjust the import path according to your Firebase setup
import Fuse from 'fuse.js'; // Import fuse.js
import WhyChooseUs from '@/components/Whychooseus';

const CarListingPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Get query parameters safely
  const queryParam = searchParams.get('query') || '';
  const brand = searchParams.get('brand') || '';
  const bodyType = searchParams.get('bodyType') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const minYear = searchParams.get('minYear') || '';
  const maxYear = searchParams.get('maxYear') || '';
  const transmission = searchParams.get('transmission') || '';
  const fuelType = searchParams.get('fuelType') || '';

  const [filters, setFilters] = useState({
    searchQuery: queryParam,
    minPrice,
    maxPrice,
    minYear,
    maxYear,
    bodyType,
    brand,
    transmission,
    fuelType,
  });

  const [cars, setCars] = useState([]); // State to store car data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [lastVisible, setLastVisible] = useState(null); // Track the last visible document for pagination
  const [hasMore, setHasMore] = useState(true); // Track if there are more items to load

  // State to manage sidebar visibility on medium and small devices
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Fetch initial car data from Firestore
  useEffect(() => {
    fetchCars();
  }, []);

  // Fetch car data (with pagination)
  const fetchCars = async (isNewSearch = false) => {
    try {
      setLoading(true);
      setError(null);

      let carsQuery = query(collection(db, 'vehicles'), limit(10));

      // Apply filters if provided
      if (filters.brand) {
        carsQuery = query(carsQuery, where('brand', '==', filters.brand));
      }
      if (filters.bodyType) {
        carsQuery = query(carsQuery, where('bodyType', '==', filters.bodyType));
      }
      if (filters.minPrice) {
        carsQuery = query(carsQuery, where('price', '>=', Number(filters.minPrice)));
      }
      if (filters.maxPrice) {
        carsQuery = query(carsQuery, where('price', '<=', Number(filters.maxPrice)));
      }
      if (filters.minYear) {
        carsQuery = query(carsQuery, where('year', '>=', Number(filters.minYear)));
      }
      if (filters.maxYear) {
        carsQuery = query(carsQuery, where('year', '<=', Number(filters.maxYear)));
      }
      if (filters.transmission) {
        carsQuery = query(carsQuery, where('transmission', '==', filters.transmission));
      }
      if (filters.fuelType) {
        carsQuery = query(carsQuery, where('fuelType', '==', filters.fuelType));
      }

      // If not a new search, start after the last visible document
      if (!isNewSearch && lastVisible) {
        carsQuery = query(carsQuery, startAfter(lastVisible));
      }

      const carsSnapshot = await getDocs(carsQuery);
      const carsData = carsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      
        setCars(carsData);
     

      // Update the last visible document
      if (carsSnapshot.docs.length > 0) {
        setLastVisible(carsSnapshot.docs[carsSnapshot.docs.length - 1]);
      } else {
        setHasMore(false); // No more items to load
      }
    } catch (error) {
      console.error('Error fetching cars:', error);
      setError('Failed to fetch cars. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle search button click
  const handleSearch = () => {
    setLastVisible(null); // Reset pagination
    setHasMore(true); // Reset hasMore
    fetchCars(true); // Perform a new search
  };

  // Handle "Load More" button click
  const handleLoadMore = () => {
    fetchCars();
  };

  // Fuzzy search using fuse.js
  const fuzzySearch = (query) => {
    const fuse = new Fuse(cars, {
      keys: ['name'], // Search only in the 'name' field
      threshold: 0.3, // Adjust the threshold for fuzzy matching
      includeScore: true,
    });

    const results = fuse.search(query);
    return results.map(result => result.item);
  };

  // Filtered cars based on fuzzy search
  const filteredCars = filters.searchQuery ? fuzzySearch(filters.searchQuery) : cars;

  return (
    <div className="bg-gray-50 min-h-screen py-6">
      <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Toggle Button for Small and Medium Devices */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="lg:hidden mb-4 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          {isSidebarOpen ? 'Hide Filters' : 'Show Filters'}
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filter Sidebar */}
          <div
            className={`lg:col-span-1 ${
              isSidebarOpen ? 'block' : 'hidden'
            } lg:block transition-all duration-300`}
          >
            <div className="bg-indigo-100 px-6 py-2 rounded-lg text-black border border-indigo-600 shadow-lg">
              <h3 className="text-lg font-bold mb-6">Search & Filter Cars</h3>

              {/* Search Input */}
              <div className="mb-6">
                <input
                  type="text"
                  name="searchQuery"
                  placeholder="Search by name..."
                  value={filters.searchQuery}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              {/* Price Range */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm mb-1">Min Price</label>
                  <input
                    type="number"
                    name="minPrice"
                    placeholder="Min"
                    value={filters.minPrice}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Max Price</label>
                  <input
                    type="number"
                    name="maxPrice"
                    placeholder="Max"
                    value={filters.maxPrice}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>

              {/* Body Type */}
              <div className="mb-6">
                <label className="block text-sm mb-1">Body Type</label>
                <select
                  name="bodyType"
                  value={filters.bodyType}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="">All Types</option>
                  <option value="SUV">SUV</option>
                  <option value="Sedan">Sedan</option>
                  <option value="Hatchback">Hatchback</option>
                  <option value="Pickup">Pickup</option>
                  <option value="Coupe">Coupe</option>
                </select>
              </div>

              {/* Brand */}
              <div className="mb-6">
                <label className="block text-sm mb-1">Brand</label>
                <select
                  name="brand"
                  value={filters.brand}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="">All Brands</option>
                  <option value="Toyota">Toyota</option>
                  <option value="Subaru">Subaru</option>
                  <option value="Nissan">Nissan</option>
                  <option value="Mazda">Mazda</option>
                  <option value="Mercedes">Mercedes</option>
                </select>
              </div>

              {/* Search Button */}
              <button
                onClick={handleSearch}
                className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-center block"
              >
                Search Vehicles
              </button>

              <button
                onClick={() =>
                  setFilters({
                    searchQuery: '',
                    minPrice: '',
                    maxPrice: '',
                    minYear: '',
                    maxYear: '',
                    bodyType: '',
                    brand: '',
                    transmission: '',
                    fuelType: '',
                  })
                }
                className="w-full py-2 px-4 bg-gray-200 hover:bg-gray-300 rounded-lg mt-4"
              >
                Clear Filters
              </button>
            </div>
          </div>

          {/* Car Listings */}
          <div className="lg:col-span-3">
            {loading ? ( // Show loading spinner while data is being fetched
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                <p className="ml-4 text-gray-700">Loading cars...</p>
              </div>
            ) : error ? ( // Show error message if fetching fails
              <div className="text-center py-20">
                <h3 className="text-xl font-bold mb-4">Error</h3>
                <p className="text-gray-600">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Retry
                </button>
              </div>
            ) : filteredCars.length > 0 ? ( // Show filtered cars
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCars.map((car) => (
                    <div
                      key={car.id}
                      className="bg-gray-300 text-black rounded-lg shadow-sm overflow-hidden"
                    >
                      <img src={car.images[0]} alt={car.name} className="w-full h-48 object-cover" />
                      <div className="p-4">
                        <h3 className="text-xl font-bold mb-2">{car.name}</h3>
                        <div className='flex justify-between ' >
                          <p className="text-gray-600 mb-2">{car.brand}</p>
                          <span className="text-lg font-bold">Ksh {car.price.toLocaleString()}</span>
                        </div>
                        <div className='flex justify-between gap-2' >
                          <button className="mt-1  p-2 px-1 bg-black text-red-800 rounded-lg hover:text-white hover:bg-green-700">
                            Tiktok Review
                          </button>
                          <button className="mt-1 p-1 bg-red-600 text-white rounded-lg hover:bg-green-700">
                            Youtube Review
                          </button>
                        </div>
                        <div className='flex justify-between gap-2' >
                          <button className="mt-4 p-2 bg-green-700 text-white rounded-lg hover:bg-green-900">
                            Enquire Now
                          </button>
                          <Link className="mt-4 p-1  bg-blue-600 text-white rounded-lg hover:bg-green-700"
                            href={`/vehicles/${car.id}`} >
                          
                              More details {">"}
                            </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Load More Button */}
                {hasMore && (
                  <div className="flex justify-center mt-8">
                    <button
                      onClick={handleLoadMore}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Load More
                    </button>
                  </div>
                )}
              </>
            ) : ( // Show empty state if no cars match the filters
              <p className="text-center text-red py-20">No cars found</p>
            )}
          </div>
        </div>
      </div>

      <WhyChooseUs />
    </div>
  );
};

export default CarListingPage;