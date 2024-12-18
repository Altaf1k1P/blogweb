import React, { useState } from "react";
import { login } from "../store/authSlice.js";
import Container from "./container.jsx";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState(null);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false); // Toggle visibility
  const { loading } = useSelector((state) => state.auth);

  const togglePasswordVisibility = () => setIsPasswordVisible(!isPasswordVisible);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Clear previous errors

    // Simple validation for empty fields
    if (!formData.username || !formData.password) {
      setError("Please fill in both username and password.");
      return;
    }

    try {
      const response = await dispatch(login(formData)).unwrap();
      if (response.accessToken) {
        localStorage.setItem("accessToken", response.accessToken);
        navigate("/"); // Redirect to home page
      } else {
        setError("Access token is missing!");
      }
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <Container>
      <div className="container max-w-lg mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center mb-6">Login</h1>
        {error && (
          <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
            <button
              onClick={() => setError(null)}
              className="absolute top-0 bottom-0 right-0 px-4 py-3"
              aria-label="Close"
            >
              <svg
                className="fill-current h-6 w-6 text-red-500"
                role="button"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <title>Close</title>
                <path d="M14.348 5.652a1 1 0 10-1.414-1.414L10 7.586 7.066 4.652a1 1 0 00-1.414 1.414L8.586 10l-2.934 2.934a1 1 0 101.414 1.414L10 12.414l2.934 2.934a1 1 0 001.414-1.414L11.414 10l2.934-2.934z" />
              </svg>
            </button>
          </div>
        )}
        <form onSubmit={handleSubmit}>
          {/* Username Input */}
          <div className="mb-4">
            <label htmlFor="username" className="block text-lg font-semibold mb-2">
              Username
            </label>
            <input
              type="text"
              id="username"
              placeholder="Enter your username"
              aria-label="Username"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            />
          </div>

          {/* Password Input */}
          <div className="mb-4 relative">
            <label htmlFor="password" className="block text-lg font-semibold mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={isPasswordVisible ? "text" : "password"}
                id="password"
                placeholder="Enter your password"
                aria-label="Password"
                className="w-full p-3 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              {/* Toggle Visibility Button */}
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute top-1/2 transform -translate-y-1/2 right-3 text-gray-500 hover:text-blue-500 focus:outline-none"
                aria-label={isPasswordVisible ? "Hide password" : "Show password"}
              >
                {isPasswordVisible ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.962 0-9-3.738-9-8.5S7.038 2 12 2c4.963 0 9 3.738 9 8.5a7.999 7.999 0 01-1.875 5.325m-1.61 1.62l-3.03 3.03a2.828 2.828 0 01-4-4l3.03-3.03" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12l-3-3m0 0l-3 3m3-3v6" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-between items-center">
            <button
              type="submit"
              className="w-full py-3 px-4 text-white font-medium rounded-md bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </div>

          {/* Signup Link */}
          <p className="mt-4 text-sm text-center text-gray-600">
            Don't have an account?{" "}
            <Link to="/signup" className="text-indigo-600 hover:underline">
              Signup
            </Link>
          </p>
        </form>
      </div>
    </Container>
  );
}

export default Login;
