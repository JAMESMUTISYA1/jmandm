"use client";
import { useState, useEffect } from 'react';
import { collection, getDocs, doc, deleteDoc, addDoc } from 'firebase/firestore';
import { db, storage } from '../../../../Shared/Firebaseconfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Link from 'next/link';

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [vehicleData, setVehicleData] = useState({
    name: '',
    price: '',
    brand: '',
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
  const [imageFiles, setImageFiles] = useState([]);

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'vehicles'));
      const vehiclesData = [];
      querySnapshot.forEach((doc) => {
        vehiclesData.push({ id: doc.id, ...doc.data() });
      });
      setVehicles(vehiclesData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      toast.error('Failed to load vehicles');
      setLoading(false);
    }
  };

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

  const handleAddVehicle = async (e) => {
    e.preventDefault();
    setUploading(true);
    
    try {
      // Upload images first
      const imageUrls = ["/v1/1.jpeg","/v1/2.jpeg","/v1/3.jpeg","/v1/4.jpeg","/v1/5.jpeg","/v1/6.jpeg"];//await uploadImages();
      
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
      
      toast.success('Vehicle added successfully!');
      setIsAddModalOpen(false);
      setVehicleData({
        name: '',
        price: '',
        brand: '',
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
      setImageFiles([]);
      fetchVehicles(); // Refresh the list
    } catch (error) {
      console.error('Error adding vehicle:', error);
      toast.error('Failed to add vehicle');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (vehicleId) => {
    if (confirm('Are you sure you want to delete this vehicle?')) {
      try {
        await deleteDoc(doc(db, 'vehicles', vehicleId));
        toast.success('Vehicle deleted successfully');
        fetchVehicles(); // Refresh the list
      } catch (error) {
        console.error('Error deleting vehicle:', error);
        toast.error('Failed to delete vehicle');
      }
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES'
    }).format(price);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Vehicle Management</h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add New Vehicle
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : vehicles.length === 0 ? (
        <p className="text-gray-500">No vehicles found</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Brand</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {vehicles.map((vehicle) => (
                <tr key={vehicle.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {vehicle.images?.length > 0 && (
                      <img 
                        src={vehicle.images[0]} 
                        alt={vehicle.name}
                        className="h-16 w-24 object-cover rounded"
                      />
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{vehicle.name}</div>
                    <div className="text-sm text-gray-500">{vehicle.bodyType}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatPrice(vehicle.price)}
                    {vehicle.cifPrice && (
                      <div className="text-xs text-gray-500">${vehicle.cifPrice.toLocaleString()}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {vehicle.year}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {vehicle.brand} 
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      vehicle.availability === 'In Stock' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {vehicle.availability}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <Link
                        href={`/admin/vehicles/${vehicle.id}`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        View
                      </Link>
                      <button
                        onClick={() => handleDelete(vehicle.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Vehicle Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Add New Vehicle</h2>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleAddVehicle}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-800">Basic Information</h3>
                  
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Brand</label>
                    <input
                      type="text"
                      name="name"
                      value={vehicleData.brand}
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
                  <h3 className="text-xl font-semibold text-gray-800">Technical Specifications</h3>
                  
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
                <h3 className="text-xl font-semibold text-gray-800">Additional Information</h3>
                
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">TikTok Link</label>
                  <input
                    type="text"
                    name="tiktokLink"
                    value={vehicleData.tiktokLink}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">YouTube Link</label>
                  <input
                    type="text"
                    name="youtubeLink"
                    value={vehicleData.youtubeLink}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Images</label>
                  <input
                    type="file"
                    multiple
                    onChange={handleImageUpload}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    accept="image/*"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Upload multiple images of the vehicle</p>
                </div>
              </div>

              <div className="mt-8 flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className={`px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {uploading ? 'Uploading...' : 'Add Vehicle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}