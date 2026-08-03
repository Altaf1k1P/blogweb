import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { logout } from "../../store/authSlice.js";
import Logo from "./Logo";
import ThemeToggle from "../ui/ThemeToggle";

export default function Header() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const navItemClass = ({ isActive }) =>
    `text-sm font-medium transition-all duration-300 relative py-1.5 px-3 rounded-md ${
      isActive
        ? "text-indigo-400 bg-indigo-500/10"
        : "text-gray-300 hover:text-white hover:bg-white/5"
    }`;

  return (
    <header className="sticky top-0 z-50 w-full glass-effect border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Branding Logo */}
        <Link to="/" aria-label="Go to homepage">
          <Logo />
        </Link>

        {/* Navigation Links - Desktop */}
        <nav className="hidden md:flex items-center space-x-6">
          <NavLink to="/" end className={navItemClass}>
            Home
          </NavLink>
          {isAuthenticated ? (
            <>
              <NavLink to={`/my-post/${user?.userId}`} className={navItemClass}>
                My Posts
              </NavLink>
              <NavLink to="/add-post" className={navItemClass}>
                Write Post
              </NavLink>
              <button
                onClick={handleLogout}
                className="text-sm font-medium text-gray-300 hover:text-red-400 py-1.5 px-3 rounded-md hover:bg-red-500/10 transition-all duration-300"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={navItemClass}>
                Login
              </NavLink>
              <NavLink to="/signup" className={navItemClass}>
                Sign Up
              </NavLink>
            </>
          )}
          <div className="h-5 w-[1px] bg-white/10 mx-2"></div>
          <ThemeToggle />
        </nav>

        {/* Mobile menu trigger */}
        <div className="flex items-center space-x-4 md:hidden">
          <ThemeToggle />
          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="p-2 text-gray-300 hover:text-white focus:outline-none"
            aria-label="Toggle Navigation Menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <i className="fas fa-times text-xl"></i>
            ) : (
              <i className="fas fa-bars text-xl"></i>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <nav className="md:hidden glass-effect border-b border-white/5 px-6 py-4 flex flex-col space-y-4">
          <NavLink
            to="/"
            end
            onClick={() => setMobileMenuOpen(false)}
            className={navItemClass}
          >
            Home
          </NavLink>
          {isAuthenticated ? (
            <>
              <NavLink
                to={`/my-post/${user?.userId}`}
                onClick={() => setMobileMenuOpen(false)}
                className={navItemClass}
              >
                My Posts
              </NavLink>
              <NavLink
                to="/add-post"
                onClick={() => setMobileMenuOpen(false)}
                className={navItemClass}
              >
                Write Post
              </NavLink>
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="text-left text-sm font-medium text-gray-300 hover:text-red-400 py-1.5 px-3 rounded-md hover:bg-red-500/10 transition-all duration-300"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className={navItemClass}
              >
                Login
              </NavLink>
              <NavLink
                to="/signup"
                onClick={() => setMobileMenuOpen(false)}
                className={navItemClass}
              >
                Sign Up
              </NavLink>
            </>
          )}
        </nav>
      )}
    </header>
  );
}
