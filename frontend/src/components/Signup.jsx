import React, { useState } from 'react';
import { createAccount } from '../store/authSlice.js';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Container from './container.jsx';
import { Link } from 'react-router-dom';

const Signup = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => setIsPasswordVisible(!isPasswordVisible);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await dispatch(createAccount(formData)).unwrap();
      if (result?.message) {
        alert(result.message); // Show success message if returned
        navigate("/login"); // Redirect to login page
      }
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <Container>
      <div className="container max-w-lg mx-auto mt-8 p-4 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Signup</h1>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-lg font-semibold mb-2">Username</label>
            <input
              type="text"
              placeholder="Username..."
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-lg font-semibold mb-2">Email</label>
            <input
              type="text"
              placeholder="Email..."
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          <div className="mb-4 relative">
            <label htmlFor="password" className="block text-lg font-semibold mb-2">Password</label>
            <input
              type={isPasswordVisible ? "text" : "password"}
              id="password"
              placeholder="Enter your password"
              className="w-full p-3 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute top-1/2 transform -translate-y-1/2 right-3 text-gray-500 hover:text-blue-500"
              aria-label={isPasswordVisible ? "Hide password" : "Show password"}
            >
              {isPasswordVisible ? "Hide" : "Show"}
            </button>
          </div>
          <div className="flex justify-between items-center">
            <button
              type="submit"
              className="px-4 py-2 text-white rounded-md bg-blue-500 hover:bg-blue-600"
            >
              Signup
            </button>
            <p className="mt-4 text-sm text-center text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-indigo-600 hover:underline">
                Login
              </Link>
            </p>
          </div>
        </form>
      </div>
    </Container>
  );
};


export default Signup;
