import React, { useState } from 'react';
import { createAccount } from '../../../store/authSlice.js';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

export default function Signup() {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => setIsPasswordVisible(!isPasswordVisible);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const result = await dispatch(createAccount(formData)).unwrap();
      const message = result?.message || result?.data?.message || "Account created successfully!";
      alert(message);
      navigate("/login");
    } catch (err) {
      setError(err.message || "Failed to create account. Email or Username might be taken.");
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 p-8 glass-effect rounded-2xl border border-white/5 shadow-2xl">
      <h1 className="text-3xl font-extrabold text-white text-center mb-2">Create Account</h1>
      <p className="text-gray-400 text-sm text-center mb-8">Join Blogweb to share your articles</p>

      {error && (
        <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg text-sm flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-red-400 hover:text-white" aria-label="Close Error alert">
            <i className="fas fa-times"></i>
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Username"
          id="username"
          type="text"
          placeholder="Enter your username"
          value={formData.username}
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          required
        />

        <Input
          label="Email Address"
          id="email"
          type="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />

        <div className="relative">
          <Input
            label="Password"
            id="password"
            type={isPasswordVisible ? "text" : "password"}
            placeholder="Min 6 characters"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute top-[42px] right-3 text-gray-500 hover:text-white transition"
            aria-label={isPasswordVisible ? "Hide password" : "Show password"}
          >
            {isPasswordVisible ? (
              <i className="fas fa-eye-slash"></i>
            ) : (
              <i className="fas fa-eye"></i>
            )}
          </button>
        </div>

        <Button
          type="submit"
          className="w-full py-3"
        >
          Sign Up
        </Button>

        <p className="mt-6 text-sm text-center text-gray-400">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-semibold hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
