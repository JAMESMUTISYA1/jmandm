"use client"
import { useState, useEffect } from 'react';
import Image from 'next/image'; // Using Next.js Image component for optimization

const Hero = () => {
  const [randomImage, setRandomImage] = useState('');
  
  // Image list with optimized images (WebP format recommended)
  const imageList = [
    {
      src: '/images/hero1.png',
      alt: 'Luxury car for sale in Kenya',
      width: 800,
      height: 600
    },
    {
      src: '/images/hero2.png',
      alt: 'Affordable used cars in Kenya',
      width: 800,
      height: 600
    },
    {
      src: '/images/hero3.png',
      alt: 'Fast car buying process in Kenya',
      width: 800,
      height: 600
    },
  ];

  useEffect(() => {
    // Select random image on component mount
    const randomIndex = Math.floor(Math.random() * imageList.length);
    setRandomImage(imageList[randomIndex]);
  }, []);

  return (
    <section 
      className="bg-gray-50 py-10 px-4 sm:px-6 lg:px-8"
      itemScope
      itemType="https://schema.org/WebPage"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-6">
        {/* Text Content with structured data */}
        <div className="md:w-1/2 space-y-8" itemProp="mainContentOfPage">
          <h1 className="text-2xl md:text-5xl font-bold text-black" itemProp="headline">
            The fastest and Safest way to buy or sell your car in Kenya
          </h1>
          
          <p className="text-xl text-gray-600" itemProp="description">
            Find what fits you with 2 steps
          </p>

          <div className="flex md:gap-20 gap-16">
            <div className="flex items-center gap-2" itemProp="step" itemScope itemType="https://schema.org/HowToStep">
              <span className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-xl">1</span>
              <h3 className="text-lg text-black font-semibold" itemProp="name">Enquire</h3>
              <meta itemProp="text" content="Make an enquiry about your desired vehicle" />
            </div>

            <div className="flex items-center gap-2" itemProp="step" itemScope itemType="https://schema.org/HowToStep">
              <span className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center text-white font-bold text-xl">2</span>
              <h3 className="text-lg text-green-600 font-semibold" itemProp="name">Pay</h3>
              <meta itemProp="text" content="Complete your payment securely" />
            </div>
          </div>
        </div>

        {/* Optimized Image Container */}
        <div className="md:w-1/2 w-full">
          {randomImage && (
            <Image
              src={randomImage.src}
              alt={randomImage.alt}
              width={randomImage.width}
              height={randomImage.height}
              className="sm:w-90 sm:h-50 md:h-78 md:w-110 lg:h-90 rounded-lg object-cover"
              loading="lazy" // Lazy loading
              placeholder="blur" // Optional: Add blur placeholder
              blurDataURL="data:image/svg+xml;base64,[BASE64_ENCODED_SVG]" // Simple placeholder
              quality={85} // Optimized quality
              priority={false} // Don't prioritize all hero images
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default Hero;