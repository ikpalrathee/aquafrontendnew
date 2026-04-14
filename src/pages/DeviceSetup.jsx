import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // Added useLocation
import { CircleMinus, CirclePlus, Loader2 } from "lucide-react"; 
import { deviceAPI } from "../api";

export default function DeviceSetup() {
  const navigate = useNavigate();
  const location = useLocation();

  // Check if we came from "Click Here"
  const isExistingUser = location.state?.isExistingUser || false;

  // Initial States
  const [numDevices, setNumDevices] = useState(1);
  const [potsPerDevice, setPotsPerDevice] = useState([1]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isExistingUser) {
      fetchExistingSettings();
    }
  }, [isExistingUser]);

  const fetchExistingSettings = async () => {
    setLoading(true);
    try {
      // MOCK DATA: Replace this with deviceAPI.getSettings() when backend is ready
      const mockData = {
        total_devices: 2,
        pots: [3, 2]
      };
      setNumDevices(mockData.total_devices);
      setPotsPerDevice(mockData.pots);
    } catch (err) {
      console.error("Failed to fetch settings", err);
    } finally {
      setLoading(false);
    }
  };

  const updateDeviceCount = (val) => {
    const newCount = Math.max(1, numDevices + val);
    setNumDevices(newCount);
    if (val > 0) {
      setPotsPerDevice([...potsPerDevice, 1]);
    } else if (potsPerDevice.length > 1) {
      setPotsPerDevice(potsPerDevice.slice(0, -1));
    }
  };

  const updatePotCount = (index, val) => {
    const newPots = [...potsPerDevice];
    newPots[index] = Math.max(1, newPots[index] + val);
    setPotsPerDevice(newPots);
  };

  // Function to save data to backend
  const handleContinue = async () => {
    setLoading(true);
    try {
      const payload = {
        total_devices: numDevices,
        device_configs: potsPerDevice.map((pots, index) => ({
          device_id: index + 1,
          pot_count: pots
        }))
      };
      
      // await deviceAPI.setupDevices(payload); // Uncomment when ready
      console.log("Saving to backend:", payload);
      navigate("/dashboard");
    } catch (err) {
      setError("Failed to save settings. Try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#d1d9d4] flex items-center justify-center">
      <Loader2 className="animate-spin text-[#2d5a1e]" size={48} />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#d1d9d4] flex items-center justify-center p-4">
      <div className="bg-[#f4f7f4] rounded-[30px] shadow-2xl p-8 w-full max-w-[360px] flex flex-col items-center border border-white/20">
        
        <h1 className="text-[#2d5a1e] text-4xl font-bold mb-1">AquaSense</h1>
        <h2 className="text-[#2d5a1e] text-2xl font-semibold mb-10">Setup your device</h2>
        
        {error && <p className="text-red-500 text-xs mb-4">{error}</p>}

        <div className="w-full space-y-8 max-h-[400px] overflow-y-auto pr-2">
          {/* Main Device Selector */}
          <div className="flex flex-col items-center gap-3">
            <label className="text-[#2d5a1e] text-sm font-bold">Select number of devices</label>
            <div className="flex items-center gap-6">
              <button onClick={() => updateDeviceCount(-1)} className="text-[#2d5a1e]">
                <CircleMinus size={32} fill="currentColor" className="text-[#2d5a1e] fill-[#2d5a1e] stroke-white" />
              </button>
              <div className="w-16 py-2 bg-white border border-[#2d5a1e]/30 rounded-lg text-center font-bold text-gray-500">
                {numDevices}
              </div>
              <button onClick={() => updateDeviceCount(1)} className="text-[#2d5a1e]">
                <CirclePlus size={32} fill="currentColor" className="text-[#2d5a1e] fill-[#2d5a1e] stroke-white" />
              </button>
            </div>
          </div>

          {/* Dynamic Pot Selectors */}
          {potsPerDevice.map((pots, idx) => (
            <div key={idx} className="flex flex-col items-center gap-3">
              <label className="text-[#2d5a1e] text-sm font-bold">Number of pots for device {idx + 1}</label>
              <div className="flex items-center gap-6">
                <button onClick={() => updatePotCount(idx, -1)} className="text-[#2d5a1e]">
                  <CircleMinus size={32} fill="currentColor" className="text-[#2d5a1e] fill-[#2d5a1e] stroke-white" />
                </button>
                <div className="w-16 py-2 bg-white border border-[#2d5a1e]/30 rounded-lg text-center font-bold text-gray-500">
                  {pots}
                </div>
                <button onClick={() => updatePotCount(idx, 1)} className="text-[#2d5a1e]">
                  <CirclePlus size={32} fill="currentColor" className="text-[#2d5a1e] fill-[#2d5a1e] stroke-white" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Continue Button */}
        <button
          onClick={handleContinue}
          className="w-full bg-[#2d5a1e] hover:bg-[#244a18] text-white rounded-full py-4 mt-12 shadow-lg transition-all active:scale-95"
        >
          <div className="flex flex-col leading-tight">
            <span className="text-xl font-bold tracking-wide uppercase">
              {isExistingUser ? "Update Settings" : "Continue"}
            </span>
            <span className="text-sm font-normal opacity-90">
              ({isExistingUser ? "अपडेट करें" : "आगे बढ़ें"})
            </span>
          </div>
        </button>

      </div>
    </div>
  );
}