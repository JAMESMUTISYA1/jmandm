"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Head from "next/head";
import { useEffect, useState, useRef } from "react";
import { PhoneIcon } from '@heroicons/react/24/outline';
import { doc, getDoc, collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from '../../../Shared/Firebaseconfig';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

const VehicleDetailsPage = () => {
  const router = useRouter();
  const topRef = useRef(null);
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [similarVehicles, setSimilarVehicles] = useState([]);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  // Scroll to top on page load
  useEffect(() => {
    topRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

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

      const vehicleDoc = await getDoc(doc(db, 'vehicles', id));
      if (vehicleDoc.exists()) {
        const vehicleData = { id: vehicleDoc.id, ...vehicleDoc.data() };
        setVehicle(vehicleData);
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
      const similarQuery = query(
        collection(db, 'vehicles'),
        where('bodyType', '==', vehicle.bodyType),
        where('id', '!=', vehicle.id), // Exclude current vehicle
        limit(3) // Limit to 5 similar vehicles
      );

      const similarSnapshot = await getDocs(similarQuery);
      const similarData = similarSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      setSimilarVehicles(similarData);
    } catch (error) {
      console.error('Error fetching similar vehicles:', error);
    }
  };

  const shareVehicle = () => {
    if (navigator.share) {
      navigator.share({
        title: `Check out this ${vehicle.name}`,
        text: `I found this ${vehicle.name} for KES ${vehicle.price.toLocaleString()}`,
        url: window.location.href,
      }).catch(err => {
        console.error('Error sharing:', err);
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
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

  // SEO Metadata
  const pageTitle = `${vehicle.name} - ${vehicle.year} | Premium Vehicle`;
  const pageDescription = vehicle.description || `Explore this ${vehicle.year} ${vehicle.name} for KES ${vehicle.price.toLocaleString()}. ${vehicle.fuelType} • ${vehicle.transmission} • ${vehicle.mileage} km`;
  const canonicalUrl = `https://yourwebsite.com/vehicles/${vehicle.id}`;

  return (
    <>
      {/* SEO Meta Tags */}
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content={`${vehicle.name}, ${vehicle.brand}, used cars, vehicles, ${vehicle.price}`} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content={vehicle.images[0]} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <link rel="canonical" href={canonicalUrl} />
      </Head>

      <div ref={topRef} className="bg-gray-50 min-h-screen py-6">
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
              <div 
                className="bg-white p-4 rounded-lg shadow-lg cursor-zoom-in"
                onClick={() => setIsImageModalOpen(true)}
              >
                <LazyLoadImage
                  src={vehicle.images[activeImageIndex]}
                  alt={`Main view - ${vehicle.name}`}
                  className="w-full h-96 object-contain rounded-lg"
                  effect="blur"
                  placeholderSrc="/placeholder-car.jpg"
                />
              </div>

              {/* Thumbnail Slider */}
              <div className="flex space-x-4 overflow-x-auto pb-4">
                {vehicle.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImageIndex(index)}
                    className={`flex-shrink-0 w-32 h-24 border-2 rounded-lg overflow-hidden transition-all ${
                      activeImageIndex === index ? "border-blue-500" : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <LazyLoadImage
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                      effect="blur"
                      placeholderSrc="/placeholder-car.jpg"
                    />
                  </button>
                ))}
              </div>

              {/* Social Links */}
              <div className="p-5 flex justify-between space-x-4">
                {vehicle.tiktokLink && (
                  <a
                    href={vehicle.tiktokLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2 px-2 bg-black text-red-800 rounded-lg hover:text-white hover:bg-green-700 text-center"
                  >
                    Tiktok Review
                  </a>
                )}
                {vehicle.youtubeLink && (
                  <a
                    href={vehicle.youtubeLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2 px-2 bg-red-600 text-white rounded-lg hover:bg-green-700 text-center"
                  >
                    Youtube Review
                  </a>
                )}
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
                  <DetailItem label="Year" value={vehicle.year} />
                  <DetailItem label="Location" value={vehicle.location} />
                  <DetailItem label="Availability" value={vehicle.availability} />
                  <DetailItem label="Drive" value={vehicle.drive} />
                  <DetailItem label="Mileage" value={`${vehicle.mileage?.toLocaleString()} km`} />
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
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                  {vehicle.description}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="w-full pt-4">
                <div className="flex flex-wrap gap-4">
                  <button 
                    onClick={shareVehicle}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <span className="mr-2">🔗</span> Share Link
                  </button>
                  <a 
                    href="tel:0748094350"
                    className="flex items-center px-4 py-2 bg-black text-white rounded-lg hover:bg-green-600"
                  >
                    <PhoneIcon className="h-5 w-5 mr-2" /> Call 0748094350
                  </a>
                  <a
                    href={`https://wa.me/254748094350?text=I'm interested in this vehicle: ${vehicle.name} (${window.location.href})`}
                    className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-700"
                  >
                    <span className="mr-2">📱</span>Enquire via WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Similar Vehicles Section */}
          <div className="mt-12">
            <h3 className="text-2xl font-bold mb-6">Similar Vehicles (Same Body Type: {vehicle.bodyType})</h3>
            {similarVehicles.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {similarVehicles.map((v) => (
                  <div key={v.id} className="bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                    <LazyLoadImage
                      src={v.images[0]}
                      alt={v.name}
                      className="w-full h-48 object-cover rounded-lg"
                      effect="blur"
                      placeholderSrc="/placeholder-car.jpg"
                    />
                    <div className="p-4">
                      <h4 className="text-xl font-bold">{v.name}</h4>
                      <div className="mt-2">
                        <p className="text-gray-600">{v.year} • {v.mileage?.toLocaleString()} km</p>
                        <p className="text-gray-600">{v.fuelType} • {v.transmission}</p>
                      </div>
                      <div className="flex justify-between items-center mt-4">
                        <span className="text-lg font-bold text-blue-600">
                          KES {v.price.toLocaleString()}
                        </span>
                        <Link
                          href={`/vehicles/${v.id}`}
                          className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900"
                          prefetch={false}
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-center py-8">No similar vehicles found with the same body type.</p>
            )}
          </div>
        </div>

        {/* Image Modal */}
        {isImageModalOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
            onClick={() => setIsImageModalOpen(false)}
          >
            <div className="max-w-4xl w-full">
              <button 
                className="absolute top-4 right-4 text-white text-4xl"
                onClick={() => setIsImageModalOpen(false)}
              >
                &times;
              </button>
              <img
                src={vehicle.images[activeImageIndex]}
                alt={`Full view - ${vehicle.name}`}
                className="w-full h-auto max-h-screen object-contain"
              />
              <div className="flex justify-center mt-4 space-x-2">
                {vehicle.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveImageIndex(index);
                    }}
                    className={`w-3 h-3 rounded-full ${activeImageIndex === index ? 'bg-white' : 'bg-gray-500'}`}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

// Reusable detail component
const DetailItem = ({ label, value }) => (
  <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
    <span className="text-gray-600">{label}:</span>
    <span className="font-medium text-gray-900">{value || 'N/A'}</span>
  </div>
);

export default VehicleDetailsPage;