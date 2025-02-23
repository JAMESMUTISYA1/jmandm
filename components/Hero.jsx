"use client"
import { useState, useEffect } from 'react';

const Hero = () => {
  const [randomImage, setRandomImage] = useState('');
  
  // Image list (replace with your actual image paths/URLs)
  const imageList = [
    '/images/hero1.png',
    '/images/hero2.png',
    '/images/hero3.png',
    '/images/hero4.png',
  ];

  useEffect(() => {
    // Select random image on component mount
    const randomIndex = Math.floor(Math.random() * imageList.length);
    setRandomImage(imageList[randomIndex]);
  }, []);

  return (
    <section className="bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-6">
        {/* Text Content */}
        <div className="md:w-1/2 space-y-8">
          <h1 className="text-2xl md:text-5xl font-bold text-black">
            The fastest and Safest way to buy or sell your car in Kenya
          </h1>
          
          <p className="text-xl text-gray-600">
            Find what fits you with 2 steps
          </p>

          <div className="flex md:gap-20 gap-16 ">
            <div className="flex items-center gap-2">
                <span className="w-12 h-12 rounded-full bg-indigo-600  flex items-center justify-center text-white font-bold text-xl">1</span>
                <h3 className="text-lg text-black   font-semibold">Enquire</h3>
           
            </div>

            <div className="flex items-center gap-2">
                <span className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center text-white font-bold text-xl">2</span>
                <h3 className="text-lg text-green-600  font-semibold">Pay</h3>
          
            </div>
          </div>
        </div>

        {/* Image Container */}
        <div className="md:w-1/2 w-full">
          {randomImage && (
            <img 
              src={randomImage}
              alt="Random vehicle"
              className="sm:w-90 sm:h-50 md:h-78 md:w-110 lg:h-90  rounded-lg  "
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default Hero;