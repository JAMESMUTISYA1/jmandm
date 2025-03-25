"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { PhoneIcon } from '@heroicons/react/24/outline';
import { doc, getDoc, collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from '../../../Shared/Firebaseconfig'; // Adjust the import path

const VehicleDetailsPage = () => {
  const router = useRouter();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [similarVehicles, setSimilarVehicles] = useState([]); // State for similar vehicles

  useEffect(() => {
    if (typeof window !== "undefined") {
      const pathParts = window.location.pathname.split("/");
      const vehicleId = pathParts[pathParts.length - 1];
      fetchVehicleDetails(vehicleId);
    }
  }, []);

  const fetchVehicleDetails = async (id) => {
    try {
      setLoading(true);
      setError(null);

      // Fetch the viewed vehicle
      const vehicleDoc = await getDoc(doc(db, 'vehicles', id));
      if (vehicleDoc.exists()) {
        const vehicleData = { id: vehicleDoc.id, ...vehicleDoc.data() };
        setVehicle(vehicleData);

        // Fetch similar vehicles based on price range or body type
        fetchSimilarVehicles(vehicleData);
      } else {
        setError('Vehicle not found');
      }
    } catch (error) {
      console.error('Error fetching vehicle details:', error);
      setError('Failed to fetch vehicle details');
    } finally {
      setLoading(false);
    }
  };

  const fetchSimilarVehicles = async (vehicle) => {
    try {
      // Define price range (±2 million of the viewed vehicle's price)
      const minPrice = vehicle.price - 2000000; // Subtract 2 million
      const maxPrice = vehicle.price + 2000000; // Add 2 million
  
      // Query similar vehicles based on price range or body type
      const similarQuery = query(
        collection(db, 'vehicles'),
        where('price', '>=', minPrice),
        where('price', '<=', maxPrice),
        where('bodyType', '==', vehicle.bodyType),
        limit(5) // Limit to 5 similar vehicles
      );
  
      const similarSnapshot = await getDocs(similarQuery);
      const similarData = similarSnapshot.docs
        .filter(doc => doc.id !== vehicle.id) // Exclude the viewed vehicle
        .map(doc => ({ id: doc.id, ...doc.data() }));
  
      setSimilarVehicles(similarData);
    } catch (error) {
      console.error('Error fetching similar vehicles:', error);
      if (error.code === 'failed-precondition') {
        console.error(
          'Firestore requires a composite index for this query. Click the link in the error message to create the index.'
        );
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="ml-4 text-gray-700">Loading vehicle details...</p>
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-20 text-red-500">{error}</div>;
  }

  if (!vehicle) {
    return <div className="text-center py-20">Vehicle not found</div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex mb-6" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li>
              <div className="flex items-center">
                <Link href="/vehicles" className="text-gray-900 text-bold hover:text-blue-600">
                  Vehicles
                </Link>
              </div>
            </li>
            <li aria-current="page">
              <div className="flex items-center">
                <span className="mx-2 text-gray-500">/</span>
                <span className="text-gray-500">{vehicle.name}</span>
              </div>
            </li>
          </ol>
        </nav>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Gallery Section */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="bg-white p-4 rounded-lg shadow-lg">
              <img
                src={vehicle.images[activeImageIndex]}
                alt={`Main view - ${vehicle.name}`}
                className="w-full h-96 object-contain rounded-lg"
              />
            </div>

            {/* Thumbnail Slider */}
            <div className="flex space-x-4 overflow-x-auto pb-4">
              {vehicle.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImageIndex(index)}
                  className={`flex-shrink-0 w-32 h-24 border-2 rounded-lg overflow-hidden ${
                    activeImageIndex === index ? "border-blue-500" : "border-gray-200"
                  }`}
                >
                  <img
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>

            <div className="p-5 flex justify-between">
              <button className="mt-1 py-2 px-2 bg-black text-red-800 rounded-lg hover:text-white hover:bg-green-700">
                Tiktok Review
              </button>
              <button className="mt-1 py-2 px-2 bg-red-600 text-white rounded-lg hover:bg-green-700">
                Youtube Review
              </button>
            </div>
          </div>

          {/* Vehicle Details Section */}
          <div className="bg-white p-6 rounded-lg shadow-lg space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">{vehicle.name}</h1>
            <div className="space-y-4">
              {/* Price Section */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <span className="text-2xl font-bold text-blue-600">
                  KES {vehicle.price.toLocaleString()}
                </span>
                {vehicle.cifPrice && (
                  <p className="text-sm text-gray-600 mt-1">
                    CIF Price: ${vehicle.cifPrice.toLocaleString()} (Africa)
                  </p>
                )}
              </div>

              {/* Key Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DetailItem label="Year of Manufacture" value={vehicle.year} />
                <DetailItem label="Current Location" value={vehicle.location} />
                <DetailItem label="Availability" value={vehicle.availability} />
                <DetailItem label="Drive" value={vehicle.drive} />
                <DetailItem label="Mileage" value={vehicle.mileage} />
                <DetailItem label="Engine Size" value={vehicle.engineSize} />
                <DetailItem label="Fuel Type" value={vehicle.fuelType} />
                <DetailItem label="Horse Power" value={vehicle.horsePower} />
                <DetailItem label="Transmission" value={vehicle.transmission} />
                <DetailItem label="Torque" value={vehicle.torque} />
                <DetailItem
                  label="Acceleration (0-100 Kph)"
                  value={vehicle.acceleration}
                />
              </div>
            </div>

            {/* Vehicle Description */}
            <div className="pt-4 border-t border-gray-200">
              <h3 className="text-xl text-black font-bold mb-3">Description</h3>
              <p className="text-gray-600 leading-relaxed">{vehicle.description}</p>
            </div>

            {/* Share Buttons */}
            <div className="w-full pt-4">
              <div className="flex-wrap md:flex justify-between">
                <button className="flex m-2 items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-green-700">
                  <span className="mr-2">🔗</span> Share Link
                </button>
                <button className="flex items-center px-4 py-2 bg-black text-white rounded-lg hover:bg-green-600">
                  <span className="mr-2"><PhoneIcon className="h-5 w-5 mr-2" /></span> Call 0748094350
                </button>
              </div>
              <button className="flex m-2 items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-700">
                <span className="mr-2">📱</span>Enquire via WhatsApp
              </button>
            </div>
          </div>
        </div>

        {/* Similar Vehicles Section */}
        <div className="mt-4 bg-gray-200 p-4 text-black">
          <h3 className="text-2xl font-bold mb-6">Similar Vehicles</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {similarVehicles.length > 0 ? (
              similarVehicles.map((v) => (
                <div key={v.id} className="bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                  <img
                    src={v.images[0]}
                    alt={v.name}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <div className="p-4">
                    <h4 className="text-xl font-bold">{v.name}</h4>
                    <div className="flex justify-between items-center mt-4">
                      <span className="text-lg font-bold text-blue-600">
                        KES {v.price.toLocaleString()}
                      </span>
                      <Link
                        href={`/vehicles/${v.id}`}
                        className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-600">No similar vehicles found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable detail component
const DetailItem = ({ label, value }) => (
  <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
    <span className="text-gray-600">{label}:</span>
    <span className="font-medium text-gray-900">{value}</span>
  </div>
);

export default VehicleDetailsPage;