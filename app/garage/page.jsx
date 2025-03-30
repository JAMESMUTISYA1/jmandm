"use client"
import OurPromise from '@/components/ourpromise';
import { useState } from 'react';

const GaragePage = () => {
  const [selectedService, setSelectedService] = useState(null);
  const [bookingDetails, setBookingDetails] = useState({
    name: '',
    phone: '',
    email: '',
    vehicleType: '',
    date: '',
    time: '',
    notes: ''
  });

  const services = [
    {
      id: 1,
      name: "Basic Service",
      description: "Oil change, filter replacement, and basic inspection",
      price: 5000,
      duration: "1-2 hours"
    },
    {
      id: 2,
      name: "Comprehensive Service",
      description: "Full vehicle inspection and maintenance",
      price: 15000,
      duration: "3-4 hours"
    },
    {
      id: 3,
      name: "Brake System Check",
      description: "Brake pads, discs, and fluid inspection",
      price: 8000,
      duration: "2-3 hours"
    },
    {
      id: 4,
      name: "Engine Tune-up",
      description: "Spark plugs, air filter, and fuel system check",
      price: 12000,
      duration: "3-4 hours"
    }
  ];

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

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Expert Garage Services
          </h1>
          <p className="text-xl text-gray-700">
            Keep your vehicle in top condition with our professional services
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
              <hr class="border-black border-1 mb-4 mt-1" />
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
          <div className="bg-white text-black  rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Book {selectedService.name}
            </h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={bookingDetails.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={bookingDetails.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={bookingDetails.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Vehicle Information */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vehicle Type
                </label>
                <select
                  name="vehicleType"
                  value={bookingDetails.vehicleType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select vehicle type</option>
                  <option value="Sedan">Sedan</option>
                  <option value="SUV">SUV</option>
                  <option value="Pickup">Pickup</option>
                  <option value="Hatchback">Hatchback</option>
                  <option value="Commercial">Commercial</option>
                </select>
              </div>

              {/* Date & Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={bookingDetails.date}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Time
                </label>
                <select
                  name="time"
                  value={bookingDetails.time}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select time</option>
                  <option value="08:00">8:00 AM</option>
                  <option value="10:00">10:00 AM</option>
                  <option value="12:00">12:00 PM</option>
                  <option value="14:00">2:00 PM</option>
                  <option value="16:00">4:00 PM</option>
                </select>
              </div>

              {/* Additional Notes */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Notes
                </label>
                <textarea
                  name="notes"
                  value={bookingDetails.notes}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Any specific issues or requests..."
                ></textarea>
              </div>

              {/* Submit Button */}
              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Book Now
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      <OurPromise/>

    </div>
  );
};

export default GaragePage;