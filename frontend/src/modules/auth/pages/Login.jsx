import React, { useState } from "react";
import { login } from "../../../store/authSlice.js";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState(null);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const { loading } = useSelector((state) => state.auth);

  const togglePasswordVisibility = () => setIsPasswordVisible(!isPasswordVisible);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.username || !formData.password) {
      setError("Please fill in both username and password.");
      return;
    }

    try {
      const response = await dispatch(login(formData)).unwrap();
      const accessToken = 
        response.data?.accessToken || 
        response.message?.accessToken || 
        response.accessToken || 
        response.data?.data?.accessToken;
      if (accessToken) {
        localStorage.setItem("accessToken", accessToken);
        navigate("/");
      } else {
        setError("Access token is missing!");
      }
    } catch (err) {
      setError(err.message || "Invalid username or password.");
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 p-8 glass-effect rounded-2xl border border-white/5 shadow-2xl">
      <h1 className="text-3xl font-extrabold text-white text-center mb-2">Welcome Back</h1>
      <p className="text-gray-400 text-sm text-center mb-8">Sign in to manage your blog articles</p>

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

        <div className="relative">
          <Input
            label="Password"
            id="password"
            type={isPasswordVisible ? "text" : "password"}
            placeholder="Enter your password"
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
          disabled={loading}
          className="w-full py-3"
        >
          {loading ? (
            <>
              <i className="fas fa-spinner animate-spin mr-2"></i> Logging in...
            </>
          ) : (
            "Login"
          )}
        </Button>

        <p className="mt-6 text-sm text-center text-gray-400">
          Don't have an account?{" "}
          <Link to="/signup" className="text-indigo-400 hover:text-indigo-300 font-semibold hover:underline">
            Signup
          </Link>
        </p>
      </form>
    </div>
  );
}
