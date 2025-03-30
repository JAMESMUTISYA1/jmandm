"use client";
import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Head from 'next/head';
import { collection, getDocs, query, limit, startAfter, where } from 'firebase/firestore';
import { db } from '../../Shared/Firebaseconfig';
import Fuse from 'fuse.js';
import WhyChooseUs from '@/components/Whychooseus';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

const CarListingPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const topRef = useRef(null);

  // Scroll to top on page load
  useEffect(() => {
    topRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // SEO Metadata
  const pageTitle = "Premium Car Listings | Find Your Dream Vehicle";
  const pageDescription = "Browse our extensive collection of quality vehicles. Find the perfect car, SUV, or truck at competitive prices.";
  const canonicalUrl = "https://yourwebsite.com/cars";

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

  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastVisible, setLastVisible] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Intersection Observer for infinite scroll
  const observer = useRef();
  const lastCarElementRef = useRef();

  // Fetch initial car data from Firestore
  useEffect(() => {
    fetchCars();
  }, []);

  // Infinite scroll setup
  useEffect(() => {
    if (loading || !hasMore) return;

    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        handleLoadMore();
      }
    });

    if (lastCarElementRef.current) {
      observer.current.observe(lastCarElementRef.current);
    }

    return () => {
      if (observer.current) observer.current.disconnect();
    };
  }, [loading, hasMore]);

  const fetchCars = async (isNewSearch = false) => {
    try {
      setLoading(true);
      setError(null);

      let carsQuery = query(collection(db, 'vehicles'), limit(12));

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

      if (!isNewSearch && lastVisible) {
        carsQuery = query(carsQuery, startAfter(lastVisible));
      }

      const carsSnapshot = await getDocs(carsQuery);
      const carsData = carsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setCars(prev => isNewSearch ? carsData : [...prev, ...carsData]);

      if (carsSnapshot.docs.length > 0) {
        setLastVisible(carsSnapshot.docs[carsSnapshot.docs.length - 1]);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error fetching cars:', error);
      setError('Failed to fetch cars. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSearch = () => {
    setLastVisible(null);
    setHasMore(true);
    fetchCars(true);
    topRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      fetchCars();
    }
  };

  const fuzzySearch = (query) => {
    const fuse = new Fuse(cars, {
      keys: ['name', 'brand', 'model'],
      threshold: 0.3,
      includeScore: true,
    });

    const results = fuse.search(query);
    return results.map(result => result.item);
  };

  const filteredCars = filters.searchQuery ? fuzzySearch(filters.searchQuery) : cars;

  return (
    <>
      {/* SEO Meta Tags */}
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content="cars, vehicles, SUVs, trucks, buy car, car dealership" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <link rel="canonical" href={canonicalUrl} />
      </Head>

      <div ref={topRef} className="bg-gray-50 min-h-screen py-6">
        <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Toggle Button for Small and Medium Devices */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="lg:hidden mb-4 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            aria-label="Toggle filters"
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
                <h2 className="text-lg font-bold mb-6">Search & Filter Cars</h2>

                {/* Search Input */}
                <div className="mb-6">
                  <label htmlFor="searchQuery" className="sr-only">Search by name</label>
                  <input
                    type="text"
                    id="searchQuery"
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
                    <label htmlFor="minPrice" className="block text-sm mb-1">Min Price</label>
                    <input
                      type="number"
                      id="minPrice"
                      name="minPrice"
                      placeholder="Min"
                      value={filters.minPrice}
                      onChange={handleFilterChange}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label htmlFor="maxPrice" className="block text-sm mb-1">Max Price</label>
                    <input
                      type="number"
                      id="maxPrice"
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
                  <label htmlFor="bodyType" className="block text-sm mb-1">Body Type</label>
                  <select
                    id="bodyType"
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
                  <label htmlFor="brand" className="block text-sm mb-1">Brand</label>
                  <select
                    id="brand"
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
                  onClick={() => {
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
                    });
                    handleSearch();
                  }}
                  className="w-full py-2 px-4 bg-gray-200 hover:bg-gray-300 rounded-lg mt-4"
                >
                  Clear Filters
                </button>
              </div>
            </div>

            {/* Car Listings */}
            <div className="lg:col-span-3">
              {loading && cars.length === 0 ? (
                <div className="flex justify-center items-center h-40">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                  <p className="ml-4 text-gray-700">Loading cars...</p>
                </div>
              ) : error ? (
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
              ) : filteredCars.length > 0 ? (
                <>
                  <h1 className="text-2xl font-bold mb-6">Available Vehicles ({filteredCars.length})</h1>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCars.map((car, index) => (
                      <div
                        key={`${car.id}-${index}`}
                        ref={index === filteredCars.length - 1 ? lastCarElementRef : null}
                        className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                      >
                        <div className="relative" style={{ width: '100%', height: '200px', overflow: 'hidden' }}>
                          <LazyLoadImage
                            src={car.images[0] || '/placeholder-car.jpg'}
                            alt={`${car.brand} ${car.model}`}
                            effect="blur"
                            className="w-full h-full"
                            style={{ 
                              objectFit: 'contain',
                              width: '100%',
                              height: '100%',
                              padding: '10px',
                              backgroundColor: '#f3f4f6'
                            }}
                            width={400}
                            height={300}
                            placeholderSrc="/placeholder-car.jpg"
                          />
                        </div>
                        <div className="p-4">
                          <h2 className="text-xl font-bold mb-2">{car.name}</h2>
                          <div className="flex justify-between">
                            <p className="text-gray-600">{car.brand}</p>
                            <span className="text-lg font-bold">Ksh {car.price.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between gap-2 mt-3">
                            {car.tiktokLink && (
                              <a
                                href={car.tiktokLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 px-1 bg-black text-red-800 rounded-lg hover:text-white hover:bg-green-700"
                              >
                                Tiktok Review
                              </a>
                            )}
                            {car.youtubeLink && (
                              <a
                                href={car.youtubeLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1 bg-red-600 text-white rounded-lg hover:bg-green-700"
                              >
                                Youtube Review
                              </a>
                            )}
                          </div>
                          <div className="flex justify-end mt-4">
                            <Link
                              href={`/vehicles/${car.id}`}
                              className="p-2 bg-blue-600 text-white rounded-lg hover:bg-green-700"
                              aria-label={`View details of ${car.name}`}
                            >
                              More details &gt;
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Loading indicator at bottom */}
                  {loading && filteredCars.length > 0 && (
                    <div className="flex justify-center my-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                  )}

                  {/* Manual Load More Button (alternative to infinite scroll) */}
                  {!loading && hasMore && (
                    <div className="flex justify-center mt-8">
                      <button
                        onClick={handleLoadMore}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        disabled={loading}
                      >
                        {loading ? 'Loading...' : 'Load More'}
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-20">
                  <h3 className="text-xl font-bold mb-4">No Cars Found</h3>
                  <p className="text-gray-600">Try adjusting your search filters</p>
                  <button
                    onClick={() => {
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
                      });
                      handleSearch();
                    }}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Reset Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <WhyChooseUs />
      </div>
    </>
  );
};

export default CarListingPage;