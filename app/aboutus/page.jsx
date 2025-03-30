"use client"
import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../Shared/Firebaseconfig'; // Adjust the import path according to your Firebase setup
import Image from 'next/image'; // For image optimization

const AboutPage = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const teamCollection = collection(db, 'ourstaff');
        console.log("Fetching collection: ourstaff");
        const teamSnapshot = await getDocs(teamCollection);
        console.log("Number of documents found:", teamSnapshot.size);
        console.log("Documents:", teamSnapshot.docs.map(doc => doc.data()));
        
        const members = teamSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        console.log("Mapped members:", members);
        
        setTeamMembers(members);
        setError(null); // Clear any previous errors
      } catch (error) {
        console.error('Error fetching team members:', error);
        setError('Failed to fetch team members. Please try again later.');
      } finally {
        setLoading(false); // Set loading to false after fetch
      }
    };
  
    fetchTeamMembers();
  }, []);

  return (
    <div className="bg-white overflow-hidden">
      {/* Hero Section */}
      <div className="bg-gray-50 py-20 px-4 sm:px-6 lg:px-8">
        <div className="w-full">
          <div className="flex items-center h-12">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-5xl">
                About Us
              </h1>
            </div>

            <div className="mx-10 lg:mx-40 flex items-center">
              <img
                src="/Logo.png" // Replace with your logo path
                alt="Logo"
                className="h-20 w-20"
              />
              <span className="ml-2 text-xl text-black font-semibold">JMandM Auto</span>
            </div>
          </div>
          <p className="mt-6 text-xl text-black max-w-2xl">
            From <span className="text-green-600">sales</span> to <span className="text-green-600">service</span>, we've got you covered
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl py-2 px-6 sm:px-6 lg:px-8">
        {/* Our Story */}
        <div className="lg:grid lg:grid-cols-2 lg:gap-16">
          <div className="mb-12 lg:mb-0">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Our Story
            </h2>
            <div className="space-y-6 text-gray-600">
              <p>
                Founded in 2023, we started as a small car dealership in Nairobi with a big dream - to transform how Kenyans buy and sell vehicles. What began as a single showroom has grown into Kenya's most trusted automotive marketplace.
              </p>
              <p>
                We've successfully facilitated over 3,000 vehicle transactions, helping individuals and businesses find their perfect match. Our comprehensive services now include vehicle financing, insurance, and after-sales support.
              </p>
              <p>
                Our mission is simple: to make car buying and selling in Kenya safer, faster, and more transparent.
              </p>
            </div>
          </div>
          <div className="relative">
            <Image
              src="/showroom.jpg"
              alt="Our Showroom"
              width={800}
              height={600}
              className="rounded-lg shadow-xl"
              priority // Prioritize loading this image
            />
            <div className="absolute -bottom-8 -right-8 bg-green-600 p-6 rounded-lg shadow-lg lg:block">
              <h3 className="text-lg font-bold text-white">3,000+</h3>
              <p className="text-white">Successful Transactions</p>
            </div>
          </div>
        </div>

        {/* Our Values */}
        <div className="mt-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Our Core Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Integrity</h3>
              <p className="text-gray-600">We believe in honest, transparent transactions</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Efficiency</h3>
              <p className="text-gray-600">Fast, seamless processes for our customers</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Community</h3>
              <p className="text-gray-600">Building trust within the Kenyan automotive community</p>
            </div>
          </div>
        </div>

        {/* Leadership Team */}
        <div className="mt-24 mb-20">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Meet Our Leadership
          </h2>
          {loading ? ( // Show loading spinner while team members are being fetched
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              <p className="ml-4 text-gray-700">Loading team members...</p>
            </div>
          ) : error ? ( // Show error message if fetching fails
            <div className="text-center">
              <p className="text-red-500 text-xl">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Retry
              </button>
            </div>
          ) : teamMembers.length === 0 ? ( // Show empty state if no team members are found
            <div className="text-center">
              <p className="text-gray-700 text-xl">No team members found.</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Refresh
              </button>
            </div>
          ) : ( // Display team members
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {teamMembers.map((member) => (
                <div key={member.id} className="text-center pb-5 w-70 bg-gray-300">
                  <Image
                    src={member.imageUrl}
                    alt={member.name}
                    width={200}
                    height={200}
                    className="w-full h-48 object-cover mb-4"
                    priority // Prioritize loading these images
                  />
                  <h3 className="text-xl pl-5 pr-5 font-bold text-gray-900">{member.name}</h3>
                  <p className="text-blue-600 pl-5 pr-5 font-medium mb-2">{member.role}</p>
                  <p className="text-gray-600 pl-5 pr-5">{member.bio}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AboutPage;