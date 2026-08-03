import React from "react";
import { Link } from "react-router-dom";
import Button from "../components/ui/Button";

export default function ServerError() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6">
      <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
        <i className="fas fa-exclamation-triangle text-3xl text-red-500"></i>
      </div>
      <h1 className="text-3xl font-bold text-white mb-2">500 - Server Error</h1>
      <p className="text-gray-400 max-w-sm mb-8 text-sm leading-relaxed">
        Something went wrong on our end. Please try again later or contact support if the issue persists.
      </p>
      <Link to="/">
        <Button variant="secondary">Go Back Home</Button>
      </Link>
    </div>
  );
}
