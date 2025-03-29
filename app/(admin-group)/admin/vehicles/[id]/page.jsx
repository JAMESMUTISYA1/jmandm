// app/admin/vehicles/[id]/page.jsx
'use client';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../../../../Shared/Firebaseconfig';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Image from 'next/image';

export default function VehicleDetails({ params }) {
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const docRef = doc(db, 'vehicles', params.id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setVehicle({ id: docSnap.id, ...docSnap.data() });
        } else {
          toast.error('Vehicle not found');
          router.push('/admin/vehicles');
        }
      } catch (error) {
        console.error('Error fetching vehicle:', error);
        toast.error('Failed to load vehicle details');
      } finally {
        setLoading(false);
      }
    };

    fetchVehicle();
  }, [params.id, router]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES'
    }).format(price);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <p className="text-gray-500">Vehicle not found</p>
        <Link href="/admin/vehicles" className="mt-4 inline-block text-blue-600 hover:underline">
          Back to vehicles list
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <ToastContainer position="top-right" autoClose={3000} />
      
      {/* Header with back button */}
      <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Vehicle Details</h1>
        <Link 
          href="/admin/vehicles"
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
        >
          Back to List
        </Link>
      </div>

      <div className="p-6">
        {/* Image Gallery */}
        <div className="mb-8">
          <div className="relative h-64 md:h-96 bg-gray-100 rounded-lg overflow-hidden mb-4">
            {vehicle.images?.length > 0 ? (
              <Image
                src={vehicle.images[activeImage]}
                alt={`${vehicle.name} - Main view`}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                No images available
              </div>
            )}
          </div>

          {vehicle.images?.length > 1 && (
            <div className="flex space-x-2 overflow-x-auto py-2">
              {vehicle.images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(index)}
                  className={`flex-shrink-0 h-16 w-24 rounded-md overflow-hidden border-2 ${activeImage === index ? 'border-blue-500' : 'border-transparent'}`}
                >
                  <Image
                    src={img}
                    alt={`Thumbnail ${index + 1}`}
                    width={96}
                    height={64}
                    className="object-cover h-full w-full"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Vehicle Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Basic Information */}
          <div>
            <h2 className="text-xl font-semibold mb-4 border-b pb-2">Basic Information</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">{vehicle.name}</h3>
                <p className="text-gray-600">{vehicle.bodyType}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Price</p>
                  <p className="font-medium">{formatPrice(vehicle.price)}</p>
                  {vehicle.cifPrice && (
                    <p className="text-sm text-gray-500">${vehicle.cifPrice.toLocaleString()}</p>
                  )}
                </div>
                <div>
                  <p className="text-sm text-gray-500">Year</p>
                  <p className="font-medium">{vehicle.year}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Mileage</p>
                  <p className="font-medium">{vehicle.mileage?.toLocaleString()} km</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <span className={`px-2 py-1 text-xs font-medium rounded ${
                    vehicle.availability === 'In Stock' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {vehicle.availability}
                  </span>
                </div>
              </div>

              {vehicle.location && (
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="font-medium">{vehicle.location}</p>
                </div>
              )}

              {vehicle.description && (
                <div>
                  <p className="text-sm text-gray-500">Description</p>
                  <p className="font-medium whitespace-pre-line">{vehicle.description}</p>
                </div>
              )}
            </div>
          </div>

          {/* Technical Specifications */}
          <div>
            <h2 className="text-xl font-semibold mb-4 border-b pb-2">Technical Specifications</h2>
            <div className="grid grid-cols-2 gap-4">
              {vehicle.engineSize && (
                <div>
                  <p className="text-sm text-gray-500">Engine Size</p>
                  <p className="font-medium">{vehicle.engineSize}</p>
                </div>
              )}
              {vehicle.fuelType && (
                <div>
                  <p className="text-sm text-gray-500">Fuel Type</p>
                  <p className="font-medium">{vehicle.fuelType}</p>
                </div>
              )}
              {vehicle.transmission && (
                <div>
                  <p className="text-sm text-gray-500">Transmission</p>
                  <p className="font-medium">{vehicle.transmission}</p>
                </div>
              )}
              {vehicle.horsePower && (
                <div>
                  <p className="text-sm text-gray-500">Horse Power</p>
                  <p className="font-medium">{vehicle.horsePower}</p>
                </div>
              )}
              {vehicle.torque && (
                <div>
                  <p className="text-sm text-gray-500">Torque</p>
                  <p className="font-medium">{vehicle.torque}</p>
                </div>
              )}
              {vehicle.acceleration && (
                <div>
                  <p className="text-sm text-gray-500">Acceleration</p>
                  <p className="font-medium">{vehicle.acceleration}</p>
                </div>
              )}
              {vehicle.conditionScore && (
                <div>
                  <p className="text-sm text-gray-500">Condition Score</p>
                  <p className="font-medium">{vehicle.conditionScore}</p>
                </div>
              )}
            </div>

            {/* Social Links */}
            {(vehicle.tiktokLink || vehicle.youtubeLink) && (
              <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4 border-b pb-2">Social Media</h2>
                <div className="flex space-x-4">
                  {vehicle.tiktokLink && (
                    <a 
                      href={vehicle.tiktokLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      TikTok Video
                    </a>
                  )}
                  {vehicle.youtubeLink && (
                    <a 
                      href={vehicle.youtubeLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      YouTube Video
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-end space-x-4 border-t pt-6">
          <Link
            href={`/admin/vehicles/edit/${vehicle.id}`}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Edit Vehicle
          </Link>
          <Link
            href="/admin/vehicles"
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            Back to List
          </Link>
        </div>
      </div>
    </div>
  );
}