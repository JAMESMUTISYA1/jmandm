"use client";
import { useState } from 'react';
import Link from 'next/link'; // Import next/link

const SearchComponent = () => {
  const [selectedBudget, setSelectedBudget] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedBodyType, setSelectedBodyType] = useState('');

  // Sample data - replace with your actual data
  const brands = ['Toyota', 'Subaru', 'Nissan', 'Mazda', 'Mercedes', 'BMW'];
  const bodyTypes = ['Sedan', 'SUV', 'Pickup', 'Hatchback', 'Coupe', 'Van'];

  const budgetRanges = [
    '0 - 500K',
    '500K - 1M',
    '1M - 2M',
    '2M - 3M',
    '3M - 5M',
    '5M - 10M',
    'Above 10M'
  ];

  // Parse the selected budget into minPrice and maxPrice
  const parseBudget = (budget) => {
    if (!budget) return { minPrice: '', maxPrice: '' };

    if (budget === 'Above 10M') {
      return { minPrice: '10000000', maxPrice: '' }; // No upper limit
    }

    const [min, max] = budget.split(' - ');
    const minPrice = min.replace('K', '000').replace('M', '000000');
    const maxPrice = max.replace('K', '000').replace('M', '000000');
    return { minPrice, maxPrice };
  };

  // Construct the query parameters for the Link
  const constructQueryParams = () => {
    const queryParams = new URLSearchParams();
    if (searchQuery) queryParams.append('query', searchQuery);
    if (selectedBrand) queryParams.append('brand', selectedBrand);
    if (selectedBodyType) queryParams.append('bodyType', selectedBodyType);

    // Add minPrice and maxPrice to the query parameters
    const { minPrice, maxPrice } = parseBudget(selectedBudget);
    if (minPrice) queryParams.append('minPrice', minPrice);
    if (maxPrice) queryParams.append('maxPrice', maxPrice);

    return queryParams.toString();
  };

  return (
    <section className="max-w-7xl mx-auto rounded-md px-12 bg-gray-200 sm:px-6 lg:px-8 py-5">
      <div className="mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
          Find what fits you
        </h2>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
        {/* Search and Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search by Name
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search vehicle name Ex. Demio"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Brand
            </label>
            <select
              className="w-full text-black px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
            >
              <option value="">All Brands</option>
              {brands.map((brand) => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Body Type
            </label>
            <select
              className="w-full text-black px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={selectedBodyType}
              onChange={(e) => setSelectedBodyType(e.target.value)}
            >
              <option value="">All Body Types</option>
              {bodyTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Budget Filter */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Filter by budget
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {budgetRanges.map((range) => (
              <button
                key={range}
                type="button"
                onClick={() => setSelectedBudget(range)}
                className={`px-4 py-2 text-sm rounded-full border ${
                  selectedBudget === range
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-blue-500'
                } transition-colors`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        {/* Search Help Text */}
        <div className="text-center mt-8">
          <hr />
          <Link
            href={`/vehicles?${constructQueryParams()}`} // Dynamically construct the URL
            className="mt-6 px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium inline-block"
          >
            Search Vehicles
          </Link>
        </div>
      </div>
    </section>
  );
};

export default SearchComponent;