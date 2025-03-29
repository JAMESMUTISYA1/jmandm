// app/(admin)/staff/page.jsx
'use client';
import { useState, useEffect } from 'react';
import { collection, getDocs, doc, deleteDoc, setDoc } from 'firebase/firestore';
import { db, storage } from '../../../../Shared/Firebaseconfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function StaffManagement() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStaff, setCurrentStaff] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'staff',
    phone: '',
    imageUrl: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'ourstaff'));
      const staffData = [];
      querySnapshot.forEach((doc) => {
        staffData.push({ id: doc.id, ...doc.data() });
      });
      setStaff(staffData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching staff:', error);
      toast.error('Failed to load staff');
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const uploadImage = async () => {
    if (!imageFile) return null;
    
    const storageRef = ref(storage, `staff-images/${Date.now()}_${imageFile.name}`);
    const uploadTask = uploadBytes(storageRef, imageFile);
    
    try {
      const snapshot = await uploadTask;
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let imageUrl = formData.imageUrl;
      
      // Upload new image if selected
      if (imageFile) {
        imageUrl = await uploadImage();
        if (!imageUrl) return;
      }

      const staffData = {
        ...formData,
        imageUrl: imageUrl || ''
      };

      if (currentStaff) {
        // Update existing staff
        await setDoc(doc(db, 'ourstaff', currentStaff.id), staffData);
        toast.success('Staff updated successfully');
      } else {
        // Add new staff
        const newStaffRef = doc(collection(db, 'ourstaff'));
        await setDoc(newStaffRef, staffData);
        toast.success('Staff added successfully');
      }
      
      setIsModalOpen(false);
      setImageFile(null);
      fetchStaff();
    } catch (error) {
      console.error('Error saving staff:', error);
      toast.error('Failed to save staff');
    }
  };

  const handleDelete = async (staffId) => {
    if (confirm('Are you sure you want to delete this staff member?')) {
      try {
        await deleteDoc(doc(db, 'ourstaff', staffId));
        toast.success('Staff deleted successfully');
        fetchStaff();
      } catch (error) {
        console.error('Error deleting staff:', error);
        toast.error('Failed to delete staff');
      }
    }
  };

  const openEditModal = (staff) => {
    setCurrentStaff(staff);
    setFormData({
      name: staff.name,
      email: staff.email,
      role: staff.role,
      phone: staff.phone,
      imageUrl: staff.imageUrl || ''
    });
    setImageFile(null);
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setCurrentStaff(null);
    setFormData({
      name: '',
      email: '',
      role: 'staff',
      phone: '',
      imageUrl: ''
    });
    setImageFile(null);
    setIsModalOpen(true);
  };

  return (
    <div className="bg-white mt-10 rounded-lg shadow p-6">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl text-black  font-bold">Staff Management</h1>
        <button
          onClick={openAddModal}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add Staff
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : staff.length === 0 ? (
        <p className="text-gray-500">No staff members found</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {staff.map((staff) => (
                <tr key={staff.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {staff.imageUrl ? (
                      <img 
                        src={staff.imageUrl} 
                        alt={staff.name}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-xs text-gray-500">No Image</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{staff.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{staff.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{staff.role}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{staff.phone}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => openEditModal(staff)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(staff.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add/Edit Staff Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {currentStaff ? 'Edit Staff' : 'Add New Staff'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Profile Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
                {formData.imageUrl && !imageFile && (
                  <div className="mt-2">
                    <img 
                      src={formData.imageUrl} 
                      alt="Current staff" 
                      className="h-20 w-20 rounded-full object-cover"
                    />
                    <p className="text-xs text-gray-500 mt-1">Current image</p>
                  </div>
                )}
                {uploadProgress > 0 && uploadProgress < 100 && (
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full" 
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="admin">Admin</option>
                  <option value="manager">Manager</option>
                  <option value="staff">Staff</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  {currentStaff ? 'Update' : 'Add'} Staff
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}