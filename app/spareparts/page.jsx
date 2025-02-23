"use client"
import { useState, useEffect } from 'react';
import { collection, getDocs, query, limit, startAfter, where, or } from 'firebase/firestore';
import { db } from '../../Shared/Firebaseconfig'; // Adjust the import path according to your Firebase setup
import Fuse from 'fuse.js'; // For fuzzy matching
import Image from 'next/image'; // For optimized image loading

const SparePartsPage = () => {
  const [filters, setFilters] = useState({
    searchQuery: '',
    category: '',
    brand: '',
  });

  const [spareParts, setSpareParts] = useState([]); // State to store spare parts data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [lastVisible, setLastVisible] = useState(null); // Track the last visible document for pagination
  const [hasMore, setHasMore] = useState(true); // Track if there are more items to load
  const [isFilterOpen, setIsFilterOpen] = useState(false); // State to toggle filter form on small devices

  // Fetch initial spare parts data from Firestore
  useEffect(() => {
    fetchSpareParts();
  }, []);

  // Fetch spare parts data (with pagination)
  const fetchSpareParts = async (isNewSearch = false) => {
    try {
      setLoading(true);
      setError(null);

      let partsQuery = query(collection(db, 'spareparts'), limit(10));

      // Apply filters if provided
      if (filters.searchQuery) {
        partsQuery = query(
          partsQuery,
          or(
            where('name', '>=', filters.searchQuery),
            where('name', '<=', filters.searchQuery + '\uf8ff'),
            where('serialNumber', '==', filters.searchQuery)
          )
        );
      }
      if (filters.category) {
        partsQuery = query(partsQuery, where('category', '==', filters.category));
      }
      if (filters.brand) {
        partsQuery = query(partsQuery, where('brand', '==', filters.brand));
      }

      // If not a new search, start after the last visible document
      if (!isNewSearch && lastVisible) {
        partsQuery = query(partsQuery, startAfter(lastVisible));
      }

      const partsSnapshot = await getDocs(partsQuery);
      const partsData = partsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      // If it's a new search, replace the existing data
      if (isNewSearch) {
        setSpareParts(partsData);
      } else {
        setSpareParts(prev => [...prev, ...partsData]);
      }

      // Update the last visible document
      if (partsSnapshot.docs.length > 0) {
        setLastVisible(partsSnapshot.docs[partsSnapshot.docs.length - 1]);
      } else {
        setHasMore(false); // No more items to load
      }
    } catch (error) {
      console.error('Error fetching spare parts:', error);
      setError('Failed to fetch spare parts. Please try again later.');
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
    fetchSpareParts(true); // Perform a new search
  };

  // Handle "Load More" button click
  const handleLoadMore = () => {
    fetchSpareParts();
  };

  // Fuzzy search using fuse.js
  const fuzzySearch = (query) => {
    const fuse = new Fuse(spareParts, {
      keys: ['name', 'serialNumber'], // Search in both 'name' and 'serialNumber' fields
      threshold: 0.3, // Adjust the threshold for fuzzy matching
      includeScore: true,
    });

    const results = fuse.search(query);
    return results.map(result => result.item);
  };

  // Filtered parts based on fuzzy search
  const filteredParts = filters.searchQuery ? fuzzySearch(filters.searchQuery) : spareParts;

  return (
    <div className="bg-gray-50 text-black min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Toggle Button for Small Devices */}
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="lg:hidden mb-4 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          {isFilterOpen ? 'Hide Filters' : 'Show Filters'}
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filter Sidebar */}
          <div
            className={`lg:col-span-1 ${
              isFilterOpen ? 'block' : 'hidden'
            } lg:block transition-all duration-300`}
          >
            <div className="bg-gray-300 p-6 rounded-lg shadow-sm">
              <h3 className="text-2xl font-bold mb-6">Filter Parts</h3>

              {/* Search Input */}
              <div className="mb-6">
                <input
                  type="text"
                  name="searchQuery"
                  placeholder="Search Name or S/N"
                  value={filters.searchQuery}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              {/* Category */}
              <div className="mb-6">
                <label className="block text-sm mb-1">Category</label>
                <select
                  name="category"
                  value={filters.category}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="">All Categories</option>
                  <option value="Engine">Engine Parts</option>
                  <option value="Brakes">Brake System</option>
                  <option value="Suspension">Suspension</option>
                  <option value="Electrical">Electrical</option>
                  <option value="Body">Body Parts</option>
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
                  <option value="Bosch">Bosch</option>
                </select>
              </div>

              <button
                onClick={handleSearch}
                className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Search
              </button>

              <button
                onClick={() => setFilters({
                  searchQuery: '',
                  category: '',
                  brand: '',
                })}
                className="w-full mt-4 py-2 px-4 bg-gray-200 hover:bg-gray-300 rounded-lg"
              >
                Clear Filters
              </button>
            </div>
          </div>

          {/* Parts Listings */}
          <div className="lg:col-span-3">
            {loading ? ( // Show loading spinner while data is being fetched
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                <p className="ml-4 text-gray-700">Loading spare parts...</p>
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
            ) : filteredParts.length > 0 ? ( // Show filtered parts
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredParts.map(part => (
                    <div key={part.id} className="bg-gray-200 rounded-lg shadow-sm overflow-hidden">
                      <Image
                        src={part.image} // Direct image URL from Firestore
                        alt={part.name}
                        width={200}
                        height={200}
                        className="w-full h-48 object-cover"
                        priority // Prioritize loading these images
                      />
                      <div className="p-4">
                        <h3 className="text-xl font-bold mb-2">{part.name}</h3>
                        <p className="text-gray-600 mb-2">{part.brand}</p>
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-lg font-bold">Ksh {part.price.toLocaleString()}</span>
                          <span className={`text-sm px-2 py-1 rounded ${
                            part.condition === 'New' ? 'bg-green-100 text-green-800' :
                            part.condition === 'Used' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {part.condition}
                          </span>
                        </div>
                        <div className="flex space-x-2">
                          <span className="bg-gray-100 px-2 py-1 rounded text-sm">{part.category}</span>
                          <span className="bg-gray-100 px-2 py-1 rounded text-sm">{part.compatibility}</span>
                        </div>
                        <button className="w-full mt-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                          Enquire Via Whatsapp
                        </button>
                        <span className='text-end text-green-600'>Or Call 0748094350</span>
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
            ) : ( // Show empty state if no parts match the filters
              <div className="text-center py-20">
                <h3 className="text-xl font-bold mb-4">No parts found</h3>
                <p className="text-gray-600">Try adjusting your filters or search terms</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SparePartsPage;