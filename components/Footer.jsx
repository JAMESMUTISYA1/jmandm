import Link from 'next/link';
import { PhoneIcon, EnvelopeIcon, MapPinIcon, FacebookIcon } from '@heroicons/react/24/outline';
//npm install @heroicons/react
const Footer = () => {
  return (
    <footer className="bg-indigo-600 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 sm:text-center lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold">About JM and M</h3>
            <p className="text-white">
              Welcome to JM and M Company Ltd, your go-to company for affordable and reliable
              vehicle experiences in Kenya.
            </p>
          </div>

          {/* Company Links */}
          <div >
            <h3 className="text-xl font-bold mb-4">COMPANY</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/aboutus" className="text-white hover:text-black hover:font-bold transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contactus" className="text-white hover:text-black hover:font-bold transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-xl font-bold mb-4">NEED HELP?</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <PhoneIcon className="h-5 w-5 mr-2" />
                <span>+254 748 094 350</span>
              </div>
              <div className="flex items-center">
                <EnvelopeIcon className="h-5 w-5 mr-2" />
                <a href="mailto:ravetmu@gmail.com" className="hover:text-black hover:font-bold">
                  ravetmu@gmail.com
                </a>
              </div>
             
            </div>
          </div>

          {/* Location */}
          <div>
            <h3 className="text-xl font-bold mb-4">LOCATION</h3>
            <div className="flex text-white sm:gap-5  md:gap-1 ">
              <MapPinIcon className="h-5 w-5" />
                Cannon towers Moi Avenue Mombasa
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white mt-8 pt-6 text-center">
          <p className="text-white">
            © {new Date().getFullYear()} JM and M Company Ltd. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;