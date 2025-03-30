// app/garage/page.jsx
"use client";
import OurPromise from '@/components/ourpromise';
import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../Shared/Firebaseconfig';

const GaragePage = () => {
  const [selectedService, setSelectedService] = useState(null);
  const [services, setServices] = useState([]);
  const [pageContent, setPageContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingDetails, setBookingDetails] = useState({
    name: '',
    phone: '',
    email: '',
    vehicleType: '',
    date: '',
    time: '',
    notes: ''
  });

  useEffect(() => {
    const fetchContent = async () => {
      try {
        // Fetch services
        const servicesSnapshot = await getDocs(collection(db, 'content'));
        const servicesData = [];
        let pageData = null;
        
        servicesSnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.type === 'services') {
            servicesData.push({
              id: doc.id,
              name: data.title,
              description: data.content,
              price: data.price || 0,
              duration: data.duration || "1-2 hours"
            });
          } else if (data.slug === 'garage-services') {
            pageData = data;
          }
        });
        
        setServices(servicesData);
        setPageContent(pageData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching content:", error);
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  const handleServiceSelect = (service) => {
    setSelectedService(service);
  };

  const handleInputChange = (e) => {
    setBookingDetails({
      ...bookingDetails,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Booking Details:', { ...bookingDetails, service: selectedService });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {pageContent?.title || "Expert Garage Services"}
          </h1>
          <p className="text-xl text-gray-700">
            {pageContent?.metaDescription || "Keep your vehicle in top condition with our professional services"}
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 bg-white md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {services.map(service => (
            <div
              key={service.id}
              onClick={() => handleServiceSelect(service)}
              className={`p-6 text-black rounded-xl hover:shadow-md hover:bg-gray-400 bg-gray-300 shadow-sm cursor-pointer transition-all ${
                selectedService?.id === service.id
                  ? 'bg-gray-400 '
                  : ''
              }`}
            > 
              <h3 className="text-xl text-blue-500 font-bold mb-2">{service.name}</h3>
              <hr className="border-black border-1 mb-4 mt-1" />
              <p className={`mb-4 ${
                selectedService?.id === service.id ? 'text-blue-100' : 'text-gray-600'
              }`}>
                {service.description}
              </p>
              <div className="flex justify-between items-center">
                <span className="font-medium">Ksh {service.price.toLocaleString()}</span>
                <span className="text-sm">{service.duration}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Booking Form */}
        {selectedService && (
          <div className="bg-white text-black rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Book {selectedService.name}
            </h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* ... (keep your existing form fields) ... */}
            </form>
          </div>
        )}
      </div>

      <OurPromise/>
    </div>
  );
};

export default GaragePage;