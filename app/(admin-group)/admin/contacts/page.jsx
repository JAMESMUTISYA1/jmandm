"use client";
import { useState, useEffect } from "react";
import { db } from '../../../../Shared/Firebaseconfig';
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


export default function UsersPage() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "contacts"));
      const contactsData = [];
      querySnapshot.forEach((doc) => {
        contactsData.push({ id: doc.id, ...doc.data() });
      });
      setContacts(contactsData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching contacts: ", error);
      toast.error("Failed to load contacts");
      setLoading(false);
    }
  };

  const markAsContacted = async (contactId) => {
    try {
      const contactRef = doc(db, "contacts", contactId);
      await updateDoc(contactRef, {
        contacted: true,
        contactedAt: new Date().toISOString()
      });
      toast.success("Marked as contacted!");
      fetchContacts(); // Refresh the list
    } catch (error) {
      console.error("Error updating contact: ", error);
      toast.error("Failed to update contact");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not contacted yet";
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <ToastContainer />
      <h1 className="text-2xl font-bold mb-6">Contact Submissions</h1>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : contacts.length === 0 ? (
        <p className="text-gray-500">No contact submissions found</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {contacts.map((contact) => (
                <tr key={contact.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{contact.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{contact.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{contact.phone}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{contact.message}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {contact.contacted ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Contacted
                      </span>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {contact.contacted ? (
                      <span className="text-gray-400">Contacted at: {formatDate(contact.contactedAt)}</span>
                    ) : (
                      <button
                        onClick={() => markAsContacted(contact.id)}
                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs"
                      >
                        Mark as Contacted
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}