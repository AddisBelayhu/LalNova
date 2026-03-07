import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-secondary text-white">
      <div className="max-w-7xl mx-auto section-padding">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold mb-4">LalNova Technologies</h3>
            <p className="text-gray-300 mb-4">
              Innovating Digital Solutions that Power Your Future. Empowering businesses through custom software, 
              strategic IT consulting, data analytics, and networking solutions to thrive in a digital-first economy.
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Mail size={16} />
                <span>info@lalnova.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone size={16} />
                <span>+251 947 101 989 / +251 942 560 505</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin size={16} />
                <span> Kirkos Subcity, Woreda 10, ORDA Ethiopa Bldg, Addis Ababa, Ethiopia
                </span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-300 hover:text-white transition-colors">
                  Solutions
                </Link>
              </li>
              <li>
                <Link to="/projects" className="text-gray-300 hover:text-white transition-colors">
                  Projects
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/partnership" className="text-gray-300 hover:text-white transition-colors">
                  Partnership
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Solutions</h4>
            <ul className="space-y-2 text-gray-300">
              <li>Software Development</li>
              <li>IT Consulting</li>
              <li>Cloud Solutions</li>
              <li>System Integration</li>
              <li>Data Analysis</li>
              <li>Digital Capacity Building</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-center items-center">
            <p className="text-gray-300 text-center">
              &copy; 2025 LalNova Technologies. All rights reserved.
            </p>
          
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;