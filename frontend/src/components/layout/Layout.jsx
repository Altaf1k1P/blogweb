import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden bg-[#0b0f19]">
      {/* Background Animated Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-purple-900/10 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-indigo-900/10 blur-[100px] pointer-events-none"></div>
      
      {/* Ambient background grid */}
      <div className="absolute inset-0 bg-grid-glow opacity-30 pointer-events-none"></div>

      <Header />
      
      <main className="flex-1 relative z-10 w-full max-w-7xl mx-auto px-6 py-8">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
