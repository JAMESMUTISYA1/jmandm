"use client";
import { useState } from "react";
import { db } from '../../../Shared/Firebaseconfig'; // Adjust the path to your Firebase config
import { collection, addDoc } from "/firebase/firestore";
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

  const locations = {
    kiambu: {
      name: "Canon Towers",
      address: "Moi avenue, Mombasa",
      mapUrl:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.808477395513!2d36.82115931475397!3d-1.286385835980925!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f10d664f5e7c7%3A0x7d9b4f4a4f4a4f4a!2sNairobi%2C%20Kenya!5e0!3m2!1sen!2ske!4v1633025000000!5m2!1sen!2ske",
    },
    westlands: {
      name: "Westlands Business Park",
      address: "Westlands, Nairobi",
      mapUrl:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.808477395513!2d36.82115931475397!3d-1.286385835980925!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f10d664f5e7c7%3A0x7d9b4f4a4f4a4f4a!2sNairobi%2C%20Kenya!5e0!3m2!1sen!2ske!4v1633025000000!5m2!1sen!2ske",
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
    try {
      // Add data to Firestore
      const docRef = await addDoc(collection(db, "contacts"), formData);
      console.log("Document written with ID: ", docRef.id);

      // Show success toast
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
    }
  };

  return (
    <div className="bg-white w-full">
      {/* Toast Container */}
      <ToastContainer />

      {/* Hero Section */}
      <div className="bg-gray-100 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="">
            <div className="flex items-center sm:gap-5 md:gap-10">
              <h1 className="font-bold text-gray-900 text-3xl md:text-6xl">
                Contact Us
              </h1>

              <div className="mx-10 lg:mx-40 flex items-center">
                <img
                  src="/logo.png" // Replace with your logo path
                  alt="Logo"
                  className="h-20 w-20"
                />
                <span className="ml-2 text-xl text-black font-semibold">
                  Your Brand
                </span>
              </div>
            </div>
            <p className="mt-6 text-xl font-bold text-black max-w-2xl">
              Visit us at any of our conveniently located offices
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full py-16 px-4 sm:px-6 lg:px-8">
        <div className="w-full">
          {/* Contact Form */}
          <div className="flex justify-center">
            <div className="w-full max-w-2xl bg-gray-300 p-5 rounded " >
              <h2 className="text-2xl text-center  font-bold text-black mb-1">
                Send us a message
              </h2>
              <hr className="border-gray-800 border-2 mt-0 mb-5" />
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-black"
                  >
                    Full Name
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 text-black py-3 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-black"
                  >
                    Email Address
                  </label>
                  <div className="mt-1">
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 text-black py-3 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-black"
                  >
                    Phone Number
                  </label>
                  <div className="mt-1">
                    <input
                      type="tel"
                      name="phone"
                      id="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 text-black py-3 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="+254 700 000 000"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Your Message
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="message"
                      name="message"
                      rows="4"
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-4 py-3 text-black border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="How can we help you?"
                      required
                    ></textarea>
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Send Message
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Contact Info */}
          <div className="bg-gray-300 flex-col items-center p-10 m-10 rounded-lg">
            <h3 className="text-xl text-center font-bold text-gray-900 mb-6">
              Contact Information
            </h3>
            <div className="space-y-4 text-center flex-wrap items-center justify-between">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg
                    className="h-6 w-6 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <div className="ml-3 text-base text-gray-600">
                  <p>Nairobi, Kenya</p>
                  <p>P.O. Box 12345-00100</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg
                    className="h-6 w-6 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>
                <div className="ml-3 text-base text-gray-600">
                  <p>+254 700 000 000</p>
                  <p>+254 711 000 000</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg
                    className="h-6 w-6 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div className="ml-3 text-base text-gray-600">
                  <p>info@yourcompany.com</p>
                  <p>support@yourcompany.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* Location Selector & Map */}
          <div className="space-y-8 bg-gray-200 p-5 m-10">
            <h2 className="text-center text-black text-3xl font-bold">
              Our Offices
            </h2>
            {/* Location Buttons */}
            <div className="flex justify-between md:justify-around gap-4 border-b-2 border-black">
              <button
                onClick={() => setSelectedLocation("kiambu")}
                className={`px-4 py-3 rounded-lg text-sm font-medium ${
                  selectedLocation === "kiambu"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Kiambu Road
              </button>
              <button
                onClick={() => setSelectedLocation("westlands")}
                className={`px-4 py-3 rounded-lg text-sm font-medium ${
                  selectedLocation === "westlands"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Westlands
              </button>
            
            </div>

            {/* Selected Location Info */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {locations[selectedLocation].name}
              </h3>
              <p className="text-gray-600 mb-4">
                {locations[selectedLocation].address}
              </p>
              <div className="flex items-center text-gray-600">
                <svg
                  className="h-5 w-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span>Open 8:00 AM - 5:00 PM, Mon-Fri</span>
              </div>
            </div>

            {/* Google Map */}
            <div className="rounded-lg overflow-hidden shadow-lg">
              <iframe
                title="Company Location"
                src={locations[selectedLocation].mapUrl}
                width="100%"
                height="400"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;