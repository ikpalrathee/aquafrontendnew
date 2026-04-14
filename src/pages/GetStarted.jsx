import React from "react";
import { useNavigate } from "react-router-dom";
import gardenerImg from "../assets/Gardener.png";

export default function GetStarted() {
  const navigate = useNavigate();

  const handleStart = () => {
    // Navigates to the registration/choice page as requested
    navigate("/register-choice");
  };

  return (
    <div className="min-h-screen bg-[#d1d9d4] flex items-center justify-center p-4">
      {/* Main Card */}
      <div className="bg-[#f0f1f0] rounded-[30px] shadow-xl p-8 w-full max-w-[350px] flex flex-col items-center border border-white/20">
        
        {/* Title */}
        <h1 className="text-[#2d5a1e] text-4xl font-bold mb-6 tracking-tight">
          AquaSense
        </h1>

        {/* Illustration Container */}
        <div className="w-full aspect-square bg-white rounded-2xl overflow-hidden mb-8 shadow-inner">
          <img 
            src={gardenerImg} 
            alt="Gardener" 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Tagline Badge */}
        <div className="bg-white/80 rounded-full px-6 py-3 mb-12 shadow-sm">
          <p className="text-gray-500 font-medium text-sm text-center">
            Smart Irrigation. Real Decisions
          </p>
        </div>

        {/* Get Started Button */}
        <button
          onClick={handleStart}
          className="w-full bg-[#2d5a1e] hover:bg-[#244a18] text-white rounded-full py-4 transition-all transform active:scale-95 shadow-lg"
        >
          <div className="flex flex-col leading-tight">
            <span className="text-xl font-bold tracking-wide uppercase">Get Started</span>
            <span className="text-sm font-normal opacity-90">(आरंभ)</span>
          </div>
        </button>

        {/* Bottom Decorative Line */}
        <div className="w-full h-[1px] bg-gray-300 mt-12 mb-4 opacity-50"></div>
      </div>
    </div>
  );
}