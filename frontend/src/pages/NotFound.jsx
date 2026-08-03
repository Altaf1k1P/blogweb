import React from "react";
import { Link } from "react-router-dom";
import Button from "../components/ui/Button";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6">
      <div className="relative mb-6">
        <h1 className="text-9xl font-black tracking-widest text-white/5 uppercase select-none">
          404
        </h1>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-indigo-400 uppercase tracking-widest animate-pulse">
            Lost in Space
          </span>
        </div>
      </div>
      <p className="text-gray-400 max-w-sm mb-8 text-sm md:text-base leading-relaxed">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Link to="/">
        <Button variant="primary">
          <i className="fas fa-home mr-2"></i> Go Back Home
        </Button>
      </Link>
    </div>
  );
}
