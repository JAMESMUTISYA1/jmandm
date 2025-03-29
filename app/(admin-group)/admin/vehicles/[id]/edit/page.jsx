// app/admin/vehicles/[id]/edit/page.jsx
'use client';
import { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db, storage } from '../../../../../../Shared/Firebaseconfig';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { useRouter } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function EditVehiclePage({ params }) {
  const router = useRouter();
  const [vehicle, setVehicle] = useState({
    name: '',
    price: '',
    cifPrice: '',
    year: '',
    location: '',
    availability: 'In Stock',
    drive: '',
    mileage: '',
    engineSize: '',
    fuelType: '',
    horsePower: '',
    transmission: '',
    torque: '',
    acceleration: '',
    description: '',
    bodyType: '',
    conditionScore: '',
    tiktokLink: '',
    youtubeLink: '',
    images: []
  });
  const [newImages, setNewImages] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const docRef = doc(db, 'vehicles', params.id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          setVehicle({
            ...data,
            price: data.price.toString(),
            cifPrice: data.cifPrice?.toString() || '',
            year: data.year.toString(),
            mileage: data.mileage?.toString() || ''
          });
        } else {
          toast.error('Vehicle not found');
          router.push('/admin/vehicles');
        }
      } catch (error) {
        console.error('Error fetching vehicle:', error);
        toast.error('Failed to load vehicle data');
      } finally {
        setLoading(false);
      }
    };

    fetchVehicle();
  }, [params.id, router]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setVehicle(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    setNewImages(Array.from(e.target.files));
  };

  const handleRemoveImage = (index) => {
    const imageToRemove = vehicle.images[index];
    setImagesToDelete(prev => [...prev, imageToRemove]);
    setVehicle(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const uploadNewImages = async () => {
    const uploadedUrls = [];
    for (const file of newImages) {
      const storageRef = ref(storage, `vehicles/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      uploadedUrls.push(url);
    }
    return uploadedUrls;
  };

  const deleteOldImages = async () => {
    for (const url of imagesToDelete) {
      const imageRef = ref(storage, url);
      try {
        await deleteObject(imageRef);
      } catch (error) {
        console.error('Error deleting image:', error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);

    try {
      // Upload new images
      const newImageUrls = await uploadNewImages();
      
      // Delete old images marked for removal
      await deleteOldImages();

      // Prepare updated data
      const updatedData = {
        ...vehicle,
        price: Number(vehicle.price),
        cifPrice: vehicle.cifPrice ? Number(vehicle.cifPrice) : null,
        year: Number(vehicle.year),
        mileage: vehicle.mileage ? Number(vehicle.mileage) : null,
        images: [...vehicle.images, ...newImageUrls],
        updatedAt: new Date()
      };

      // Update Firestore document
      const docRef = doc(db, 'vehicles', params.id);
      await updateDoc(docRef, updatedData);

      toast.success('Vehicle updated successfully!');
      router.push(`/admin/vehicles/${params.id}`);
    } catch (error) {
      console.error('Error updating vehicle:', error);
      toast.error('Failed to update vehicle');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <ToastContainer position="top-center" autoClose={3000} />
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Edit Vehicle</h1>
          <Link 
            href={`/admin/vehicles/${params.id}`}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            Cancel
          </Link>
        </div>
        
        <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800">Basic Information</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Name *</label>
                <input
                  type="text"
                  name="name"
                  value={vehicle.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price (KES) *</label>
                <input
                  type="number"
                  name="price"
                  value={vehicle.price}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">CIF Price (USD)</label>
                <input
                  type="number"
                  name="cifPrice"
                  value={vehicle.cifPrice}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Year *</label>
                <input
                  type="number"
                  name="year"
                  value={vehicle.year}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Body Type *</label>
                <select
                  name="bodyType"
                  value={vehicle.bodyType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                >
                  <option value="">Select Body Type</option>
                  <option value="SUV">SUV</option>
                  <option value="Sedan">Sedan</option>
                  <option value="Hatchback">Hatchback</option>
                  <option value="Pickup">Pickup</option>
                  <option value="Coupe">Coupe</option>
                </select>
              </div>
            </div>

            {/* Technical Specifications */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800">Technical Specifications</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Engine Size</label>
                <input
                  type="text"
                  name="engineSize"
                  value={vehicle.engineSize}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fuel Type</label>
                <select
                  name="fuelType"
                  value={vehicle.fuelType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select Fuel Type</option>
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="Electric">Electric</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Transmission</label>
                <select
                  name="transmission"
                  value={vehicle.transmission}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select Transmission</option>
                  <option value="Automatic">Automatic</option>
                  <option value="Manual">Manual</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mileage (km)</label>
                <input
                  type="number"
                  name="mileage"
                  value={vehicle.mileage}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Horse Power</label>
                <input
                  type="text"
                  name="horsePower"
                  value={vehicle.horsePower}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="mt-6 space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">Additional Information</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                type="text"
                name="location"
                value={vehicle.location}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Condition Score</label>
              <input
                type="text"
                name="conditionScore"
                value={vehicle.conditionScore}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="e.g., 9/10"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                name="description"
                value={vehicle.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tiktok Link</label>
              <input
                type="text"
                name="tiktokLink"
                value={vehicle.tiktokLink}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Youtube Link</label>
              <input
                type="text"
                name="youtubeLink"
                value={vehicle.youtubeLink}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>

          {/* Image Management */}
          <div className="mt-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Vehicle Images</h2>
            
            {/* Current Images */}
            {vehicle.images.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Current Images</h3>
                <div className="flex flex-wrap gap-4">
                  {vehicle.images.map((img, index) => (
                    <div key={index} className="relative group">
                      <img 
                        src={img} 
                        alt={`Vehicle ${index + 1}`}
                        className="h-32 w-48 object-cover rounded-md"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Add New Images */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Add More Images</label>
              <input
                type="file"
                multiple
                onChange={handleImageUpload}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                accept="image/*"
              />
              <p className="text-xs text-gray-500 mt-1">Select multiple images to upload</p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8">
            <button
              type="submit"
              disabled={updating}
              className={`w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 ${updating ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {updating ? 'Updating...' : 'Update Vehicle'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}