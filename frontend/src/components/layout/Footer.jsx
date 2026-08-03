import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';

export default function Footer() {
  const footerLinks = [
    {
      title: 'Platform',
      links: [
        { label: 'Articles', path: '/' },
        { label: 'Write', path: '/add-post' },
        { label: 'Guidelines', path: '/' }
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'About Us', path: '/' },
        { label: 'Contact', path: '/' },
        { label: 'Careers', path: '/' }
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Privacy Policy', path: '/' },
        { label: 'Terms of Use', path: '/' },
        { label: 'Cookie Settings', path: '/' }
      ],
    },
  ];

  return (
    <footer className="w-full bg-[#0b0f19] border-t border-white/5 py-12 text-gray-400 mt-auto">
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-5 gap-8">
        
        {/* Branding Area */}
        <div className="md:col-span-2 flex flex-col space-y-4">
          <Logo />
          <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
            Evolving ideas, code insights, and design inspirations from creators around the globe.
          </p>
          <div className="flex space-x-4 pt-2">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors duration-300" aria-label="GitHub">
              <i className="fab fa-github text-xl"></i>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors duration-300" aria-label="Twitter">
              <i className="fab fa-twitter text-xl"></i>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors duration-300" aria-label="LinkedIn">
              <i className="fab fa-linkedin text-xl"></i>
            </a>
          </div>
        </div>

        {/* Links Area */}
        {footerLinks.map((section, idx) => (
          <div key={idx} className="flex flex-col space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              {section.title}
            </h4>
            <ul className="space-y-2">
              {section.links.map((link, linkIdx) => (
                <li key={linkIdx}>
                  <Link
                    to={link.path}
                    className="text-sm hover:text-white transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 border-t border-white/5 mt-10 pt-6 flex flex-col sm:flex-row justify-between text-xs text-gray-500">
        <p>&copy; {new Date().getFullYear()} Blogweb platform. All rights reserved.</p>
        <p className="mt-2 sm:mt-0">Designed for developers & creators.</p>
      </div>
    </footer>
  );
}
