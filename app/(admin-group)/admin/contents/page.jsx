// app/(admin)/content/page.jsx
"use client";
import { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc, addDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../../../Shared/Firebaseconfig';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ContentManagementPage() {
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentContent, setCurrentContent] = useState(null);
  const [activeTab, setActiveTab] = useState('pages');
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    metaTitle: '',
    metaDescription: '',
    isActive: true,
    type: 'page'
  });

  useEffect(() => {
    fetchContents();
  }, [activeTab]);

  const fetchContents = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, 'content'));
      const contentsData = [];
      querySnapshot.forEach((doc) => {
        if (doc.data().type === activeTab) {
          contentsData.push({ id: doc.id, ...doc.data() });
        }
      });
      setContents(contentsData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching content: ", error);
      toast.error("Failed to load content");
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const contentData = {
        ...formData,
        type: activeTab,
        updatedAt: new Date().toISOString()
      };

      if (currentContent) {
        // Update existing content
        await updateDoc(doc(db, 'content', currentContent.id), contentData);
        toast.success('Content updated successfully');
      } else {
        // Add new content
        contentData.createdAt = new Date().toISOString();
        await addDoc(collection(db, 'content'), contentData);
        toast.success('Content added successfully');
      }
      
      setIsModalOpen(false);
      fetchContents();
    } catch (error) {
      console.error('Error saving content:', error);
      toast.error('Failed to save content');
    }
  };

  const handleDelete = async (contentId) => {
    if (confirm('Are you sure you want to delete this content?')) {
      try {
        await deleteDoc(doc(db, 'content', contentId));
        toast.success('Content deleted successfully');
        fetchContents();
      } catch (error) {
        console.error('Error deleting content:', error);
        toast.error('Failed to delete content');
      }
    }
  };

  const openEditModal = (content) => {
    setCurrentContent(content);
    setFormData({
      title: content.title,
      slug: content.slug,
      content: content.content,
      metaTitle: content.metaTitle,
      metaDescription: content.metaDescription,
      isActive: content.isActive,
      type: content.type
    });
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setCurrentContent(null);
    setFormData({
      title: '',
      slug: '',
      content: '',
      metaTitle: '',
      metaDescription: '',
      isActive: true,
      type: activeTab
    });
    setIsModalOpen(true);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Content Management</h1>
        <button
          onClick={openAddModal}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add New Content
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b mb-6">
        <button
          onClick={() => setActiveTab('pages')}
          className={`px-4 py-2 font-medium ${activeTab === 'pages' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
        >
          Pages
        </button>
        <button
          onClick={() => setActiveTab('services')}
          className={`px-4 py-2 font-medium ${activeTab === 'services' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
        >
          Services
        </button>
        <button
          onClick={() => setActiveTab('promises')}
          className={`px-4 py-2 font-medium ${activeTab === 'promises' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
        >
          Our Promises
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : contents.length === 0 ? (
        <p className="text-gray-500">No content found</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Slug</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {contents.map((content) => (
                <tr key={content.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{content.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">/{content.slug}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {content.isActive ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Active
                      </span>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                        Inactive
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(content.updatedAt || content.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => openEditModal(content)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(content.id)}
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

      {/* Add/Edit Content Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {currentContent ? 'Edit Content' : 'Add New Content'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title*</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Slug*</label>
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Meta Title</label>
                  <input
                    type="text"
                    name="metaTitle"
                    value={formData.metaTitle}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    name="isActive"
                    value={formData.isActive}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value={true}>Active</option>
                    <option value={false}>Inactive</option>
                  </select>
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
                <textarea
                  name="metaDescription"
                  value={formData.metaDescription}
                  onChange={handleInputChange}
                  rows="2"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Content*</label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  rows="10"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
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
                  {currentContent ? 'Update' : 'Save'} Content
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}