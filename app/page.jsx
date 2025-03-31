import Hero from '@/components/Hero'
import SearchComponent from '@/components/Searchform'
import WhyChooseUs from '@/components/Whychooseus'
import Head from 'next/head' // For SEO meta tags
import React from 'react'

const HomePage = () => {
  return (
    <>
      {/* SEO Optimization */}
      <Head>
        <title>Fast & Safe Car Buying/Selling Platform in Kenya</title>
        <meta 
          name="description" 
          content="The fastest and safest way to buy or sell your car in Kenya. Complete your transaction in just 2 simple steps - Enquire and Pay." 
        />
        <meta name="keywords" content="buy car Kenya, sell car Kenya, used cars Kenya, car dealership Kenya" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="Fast & Safe Car Buying/Selling Platform in Kenya" />
        <meta property="og:description" content="The fastest and safest way to buy or sell your car in Kenya." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://yourwebsite.com" />
        {/* Add canonical URL if needed */}
        <link rel="canonical" href="https://yourwebsite.com" />
      </Head>

      {/* Main Content with structured data */}
      <main 
        className="bg-white text-black"
        itemScope
        itemType="https://schema.org/WebPage"
      >
        {/* Hero Section */}
        <Hero />
        
        {/* Search Component */}
        <SearchComponent />
        
        {/* Why Choose Us Section */}
        <WhyChooseUs />

       
      </main>
    </>
  )
}

// Better naming convention for the component
export default HomePage