import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Phone } from "lucide-react";

export default function RegisterChoice() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  // Handler for Name: Allows only Alphabets and Spaces
  const handleNameChange = (e) => {
    const value = e.target.value;
    // Regex: ^[A-Za-z\s]*$ means only letters and spaces from start to end
    if (/^[A-Za-z\s]*$/.test(value)) {
      setName(value);
    }
  };

  // Handler for Phone: Allows only Numbers and max 10 digits
  const handlePhoneChange = (e) => {
    const value = e.target.value;
    // Regex: ^[0-9]*$ means only digits. Also check length <= 10
    if (/^[0-9]*$/.test(value) && value.length <= 10) {
      setPhone(value);
    }
  };

  const isFormValid = name.trim() !== "" && phone.length === 10;

  return (
    <div className="min-h-screen bg-[#d1d9d4] flex items-center justify-center p-4">
      <div className="bg-[#f4f7f4] rounded-[30px] shadow-2xl p-8 w-full max-w-[360px] flex flex-col items-center border border-white/20">
        
        {/* Branding */}
        <h1 className="text-[#2d5a1e] text-4xl font-bold mb-1">AquaSense</h1>
        <h2 className="text-[#2d5a1e] text-2xl font-semibold mb-2">Register Now</h2>
        
        <p className="text-gray-600 text-xs mb-8">
          Already registered?{" "}
          <button 
            onClick={() => navigate("/device-setup", { state: { isExistingUser: true } })} 
            className="text-[#2d5a1e] font-bold underline decoration-1 underline-offset-2"
            >
            Click Here
            </button>
        </p>

        {/* Form Fields */}
        <div className="w-full space-y-6">
          {/* Name Field */}
          <div className="flex flex-col gap-1">
            <label className="text-[#2d5a1e] text-sm font-bold ml-1">Name</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <User size={18} />
              </span>
              <input
                type="text"
                placeholder="Your Name"
                value={name}
                onChange={handleNameChange}
                className="w-full bg-white border border-[#2d5a1e]/50 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-[#2d5a1e]/20 placeholder:text-gray-300"
              />
            </div>
          </div>

          {/* Phone Field */}
          <div className="flex flex-col gap-1">
            <label className="text-[#2d5a1e] text-sm font-bold ml-1">Phone Number</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Phone size={18} />
              </span>
              <input
                type="text"
                inputMode="numeric"
                placeholder="+91 | 12345 67890"
                value={phone}
                onChange={handlePhoneChange}
                className="w-full bg-white border border-[#2d5a1e]/50 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-[#2d5a1e]/20 placeholder:text-gray-300"
              />
            </div>
          </div>
        </div>

        {/* Register Button */}
        <button
          disabled={!isFormValid}
          className={`w-full text-white rounded-full py-4 mt-12 shadow-lg transition-all active:scale-95 ${
            isFormValid ? "bg-[#2d5a1e] hover:bg-[#244a18]" : "bg-gray-400 cursor-not-allowed"
          }`}
          onClick={() => navigate("/device-setup")}
        >
          <div className="flex flex-col leading-tight">
            <span className="text-xl font-bold tracking-wide uppercase">Register</span>
            <span className="text-sm font-normal opacity-90">(पंजीकरण करें)</span>
          </div>
        </button>
      </div>
    </div>
  );
}