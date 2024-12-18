import React from 'react';
import Logo from '../Logo.jsx';

function Footer() {
  const footerLinks = [
    {
      title: 'Company',
      links: ['Features', 'Pricing', 'Affiliate Program', 'Press Kit'],
    },
    {
      title: 'Support',
      links: ['Account', 'Help', 'Contact Us', 'Customer Support'],
    },
    {
      title: 'Legals',
      links: ['Terms & Conditions', 'Privacy Policy', 'Licensing'],
    },
  ];

  return (
    <footer className="relative overflow-hidden py-12 bg-black text-gray-400 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-wrap -m-6">
          {/* Logo and About Section */}
          <div className="w-full md:w-1/2 lg:w-4/12 p-6">
            <div className="flex flex-col justify-between h-full">
              <div className="mb-6">
                <Logo width="150px" alt="Company Logo" />
              </div>
              <p className="text-sm leading-6">
                &copy; {new Date().getFullYear()} DevUI. All Rights Reserved.
              </p>
            </div>
          </div>

          {/* Dynamic Links */}
          {footerLinks.map((section, index) => (
            <div className="w-full md:w-1/2 lg:w-2/12 p-6" key={index}>
              <h3 className="text-xs font-semibold uppercase mb-6 text-gray-500">
                {section.title}
              </h3>
              <ul>
                {section.links.map((link, idx) => (
                  <li key={idx} className="mb-4">
                    <a
                      href="/"
                      className="text-base font-medium hover:text-white hover:scale-105 transition-all duration-300 ease-in-out"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Social Media Section */}
          <div className="w-full md:w-1/2 lg:w-4/12 p-6">
            <h3 className="text-xs font-semibold uppercase mb-6 text-gray-500">
              Follow Us
            </h3>
            <div className="flex space-x-6">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white hover:scale-110 transition-all duration-300"
                aria-label="Facebook"
              >
                <i className="fab fa-facebook-f"></i>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white hover:scale-110 transition-all duration-300"
                aria-label="Twitter"
              >
                <i className="fab fa-twitter"></i>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white hover:scale-110 transition-all duration-300"
                aria-label="LinkedIn"
              >
                <i className="fab fa-linkedin-in"></i>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white hover:scale-110 transition-all duration-300"
                aria-label="Instagram"
              >
                <i className="fab fa-instagram"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
