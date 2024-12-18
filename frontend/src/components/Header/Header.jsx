import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Logout from "./Logout";


function Header() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
 

  return (
    <header className="bg-black text-white">
      {/* Social Icons */}
      <div className="flex justify-start items-center space-x-6 px-6 py-4">
        <a href="/" className="hover:text-gray-400" aria-label="Facebook">
          <i className="fab fa-facebook-f"></i>
        </a>
        <a href="/" className="hover:text-gray-400" aria-label="Twitter">
          <i className="fab fa-twitter"></i>
        </a>
        <a href="/" className="hover:text-gray-400" aria-label="Instagram">
          <i className="fab fa-instagram"></i>
        </a>
        <a href="/" className="hover:text-gray-400" aria-label="TikTok">
          <i className="fab fa-tiktok"></i>
        </a>
        <a href="/" className="hover:text-gray-400" aria-label="YouTube">
          <i className="fab fa-youtube"></i>
        </a>
      </div>

      {/* Logo Section */}
      <div className="text-center py-4">
        <h1 className="text-5xl font-bold uppercase tracking-widest">LOGO</h1>
      </div>

      {/* Navigation Links */}
      <nav className="border-t border-gray-700">
        <ul className="flex justify-center space-x-8 py-4 text-gray-400 italic">
          <li>
            <Link to="/" className="hover:text-white transition-all">Home</Link>
          </li>

          {/* Conditional Rendering */}
          {isAuthenticated ? (
            <>
              <li>
                <Link to={`/my-post/${user?.userId}`} className="hover:text-white transition-all">MyPost</Link>
              </li>
              <li>
                <Link to="/add-post" className="hover:text-white transition-all">AddPost</Link>
              </li>
              <li>
                <Logout />
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/signup" className="hover:text-white transition-all">Signup</Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-white transition-all">Login</Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default Header;
