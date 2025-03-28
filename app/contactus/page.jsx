"use client";
import { useState } from "react";
import { db } from '../../Shared/Firebaseconfig';
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ContactPage = () => {
  const [selectedLocation, setSelectedLocation] = useState("kiambu");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const locations = {
    kiambu: {
      name: "Canon Towers",
      address: "Moi avenue, Mombasa",
      mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.808477395513!2d36.82115931475397!3d-1.286385835980925!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f10d664f5e7c7%3A0x7d9b4f4a4f4a4f4a!2sNairobi%2C%20Kenya!5e0!3m2!1sen!2ske!4v1633025000000!5m2!1sen!2ske",
    },
    westlands: {
      name: "Westlands Business Park",
      address: "Westlands, Nairobi",
      mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.808477395513!2d36.82115931475397!3d-1.286385835980925!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f10d664f5e7c7%3A0x7d9b4f4a4f4a4f4a!2sNairobi%2C%20Kenya!5e0!3m2!1sen!2ske!4v1633025000000!5m2!1sen!2ske",
    },
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Add data to Firestore with additional fields
      await addDoc(collection(db, "contacts"), {
        ...formData,
        contacted: false, // Default to not contacted
        contactedAt: null, // Will be set when admin marks as contacted
        createdAt: serverTimestamp(), // Submission timestamp
        location: selectedLocation, // Store selected location
        status: "new" // Additional status field
      });

      toast.success("Message sent successfully!");
      
      // Clear form
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
      });
    } catch (error) {
      console.error("Error adding document: ", error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white w-full min-h-screen">
      <ToastContainer position="top-center" autoClose={3000} />

      {/* Hero Section */}
      <div className="bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
                Contact Us
              </h1>
              <p className="text-xl text-gray-700 max-w-2xl">
                We're here to help with any questions about our vehicles or services
              </p>
            </div>
            <div className="flex items-center mt-6 md:mt-0">
              <img
                src="/Logo.png"
                alt="JMandM Auto Logo"
                className="h-16 w-16 md:h-20 md:w-20"
              />
              <span className="ml-3 text-xl md:text-2xl font-semibold text-gray-900">
                JMandM Auto
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Contact Form */}
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="w-full lg:w-1/2">
              <div className="bg-white p-6 md:p-8 rounded-lg shadow-md border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Send Us a Message
                </h2>
                <form className="space-y-5" onSubmit={handleSubmit}>
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Your name"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      id="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="+254 700 000 000"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                      Your Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows="5"
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="How can we help you?"
                      required
                    ></textarea>
                  </div>

                  <div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Contact Info and Locations */}
            <div className="w-full lg:w-1/2 space-y-8">
              {/* Contact Information */}
              <div className="bg-white p-6 md:p-8 rounded-lg shadow-md border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Contact Information
                </h2>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 pt-1">
                      <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-medium text-gray-900">Our Address</h3>
                      <p className="text-gray-600">Nairobi, Kenya</p>
                      <p className="text-gray-600">P.O. Box 12345-00100</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0 pt-1">
                      <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-medium text-gray-900">Phone Numbers</h3>
                      <p className="text-gray-600">+254 700 000 000</p>
                      <p className="text-gray-600">+254 711 000 000</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0 pt-1">
                      <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-medium text-gray-900">Email Addresses</h3>
                      <p className="text-gray-600">info@jmandmauto.com</p>
                      <p className="text-gray-600">sales@jmandmauto.com</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Locations */}
              <div className="bg-white p-6 md:p-8 rounded-lg shadow-md border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Our Offices
                </h2>
                
                {/* Location Selector */}
                <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
                  {Object.keys(locations).map((locationKey) => (
                    <button
                      key={locationKey}
                      onClick={() => setSelectedLocation(locationKey)}
                      className={`px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap ${
                        selectedLocation === locationKey
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {locations[locationKey].name}
                    </button>
                  ))}
                </div>

                {/* Selected Location Info */}
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-900">
                    {locations[selectedLocation].name}
                  </h3>
                  <p className="text-gray-600 mt-1">
                    {locations[selectedLocation].address}
                  </p>
                  <div className="flex items-center text-gray-600 mt-2">
                    <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Open 8:00 AM - 5:00 PM, Monday to Friday</span>
                  </div>
                </div>

                {/* Google Map */}
                <div className="rounded-lg overflow-hidden shadow-lg">
                  <iframe
                    title="Company Location"
                    src={locations[selectedLocation].mapUrl}
                    width="100%"
                    height="300"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    className="min-h-[300px]"
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;