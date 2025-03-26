"use client";
import { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../../Shared/Firebaseconfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../../Shared/Firebaseconfig';

const AdminUploadPage = () => {
  const [vehicleData, setVehicleData] = useState({
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
    images: []
  });

  const [imageFiles, setImageFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setVehicleData({ ...vehicleData, [name]: value });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(files);
  };

  const uploadImages = async () => {
    const imageUrls = [];
    for (const file of imageFiles) {
      const storageRef = ref(storage, `vehicles/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      imageUrls.push(url);
    }
    return imageUrls;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    
    try {
      // Upload images first
      const imageUrls = await uploadImages();
      
      // Prepare vehicle data with image URLs
      const dataToUpload = {
        ...vehicleData,
        price: Number(vehicleData.price),
        cifPrice: vehicleData.cifPrice ? Number(vehicleData.cifPrice) : null,
        year: Number(vehicleData.year),
        mileage: Number(vehicleData.mileage),
        images: imageUrls,
        createdAt: new Date()
      };

      // Add to Firestore
      await addDoc(collection(db, 'vehicles'), dataToUpload);
      
      setSuccess(true);
      // Reset form
      setVehicleData({
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
        images: []
      });
      setImageFiles([]);
    } catch (error) {
      console.error('Error uploading vehicle:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Upload Vehicle Data</h1>
        
        <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-6">
          {success && (
            <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg">
              Vehicle uploaded successfully!
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800">Basic Information</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Name</label>
                <input
                  type="text"
                  name="name"
                  value={vehicleData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price (KES)</label>
                <input
                  type="number"
                  name="price"
                  value={vehicleData.price}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">CIF Price (USD, optional)</label>
                <input
                  type="number"
                  name="cifPrice"
                  value={vehicleData.cifPrice}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                <input
                  type="number"
                  name="year"
                  value={vehicleData.year}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Body Type</label>
                <select
                  name="bodyType"
                  value={vehicleData.bodyType}
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
                  value={vehicleData.engineSize}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fuel Type</label>
                <select
                  name="fuelType"
                  value={vehicleData.fuelType}
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
                  value={vehicleData.transmission}
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
                  value={vehicleData.mileage}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Horse Power</label>
                <input
                  type="text"
                  name="horsePower"
                  value={vehicleData.horsePower}
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
                value={vehicleData.location}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Condition Score</label>
              <input
                type="text"
                name="conditionScore"
                value={vehicleData.conditionScore}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="e.g., 9/10"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                name="description"
                value={vehicleData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Images</label>
              <input
                type="file"
                multiple
                onChange={handleImageUpload}
                className="w-full  px-3 py-2 border border-gray-300 rounded-md"
                accept="image/*"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Upload multiple images of the vehicle</p>
            </div>
          </div>

          <div className="mt-8">
            <button
              type="submit"
              disabled={uploading}
              className={`w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {uploading ? 'Uploading...' : 'Upload Vehicle'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminUploadPage;