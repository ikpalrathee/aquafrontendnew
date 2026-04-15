import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ChevronLeft, CheckCircle, MessageSquare, BarChart3, Settings2, Loader2 } from "lucide-react";
import { deviceAPI } from "../api"; // Ensure this import is correct

export default function GardenStatus() {
  const navigate = useNavigate();
  const location = useLocation();

  // 1. Local State
  const [config, setConfig] = useState(location.state?.device_configs || []);
  const [deviceStatus, setDeviceStatus] = useState({});
  const [potStatus, setPotStatus] = useState({});
  const [loading, setLoading] = useState(!location.state?.device_configs);
  const [activeModal, setActiveModal] = useState(null);

  // 2. The useEffect Hook: Handles Data Fetching & State Initialization
  // Inside GardenStatus.jsx
useEffect(() => {
  const initializeGarden = async () => {
    let currentConfig = config;

    if (currentConfig.length === 0 || (currentConfig.length === 1 && !currentConfig[0].pot_count)) {
      try {
        const data = await deviceAPI.getSettings();
        // Check if data is an array or an object containing an array
        currentConfig = Array.isArray(data) ? data : (data.device_configs || []);
        setConfig(currentConfig);
      } catch (err) {
        console.error("Could not recover state from API:", err);
      }
    }

    // Initialize UI Toggles
    if (currentConfig.length > 0) {
      const initialDeviceStatus = {};
      const initialPotStatus = {};
      currentConfig.forEach((dev) => {
        initialDeviceStatus[dev.device_id] = true;
        const pots = dev.pot_count || 1; 
        for (let i = 1; i <= pots; i++) {
          initialPotStatus[`d${dev.device_id}-p${i}`] = true;
        }
      });
      setDeviceStatus(initialDeviceStatus);
      setPotStatus(initialPotStatus);
    }
    setLoading(false);
  };

  initializeGarden();
}, [location.state]);

  // 3. Logic Handlers
  const toggleDevice = (deviceId) => {
    if (deviceStatus[deviceId]) {
      setActiveModal(deviceId);
    } else {
      setDeviceStatus((prev) => ({ ...prev, [deviceId]: true }));
      const newPots = { ...potStatus };
      Object.keys(newPots).forEach((key) => {
        if (key.startsWith(`d${deviceId}-`)) newPots[key] = true;
      });
      setPotStatus(newPots);
    }
  };

  const handlePotToggle = (potId) => {
    setPotStatus((prev) => ({ ...prev, [potId]: !prev[potId] }));
  };

  const confirmDeviceOff = (deviceId) => {
    const devicePots = Object.keys(potStatus).filter((key) => key.startsWith(`d${deviceId}-`));
    const isAnyPotOn = devicePots.some((potId) => potStatus[potId]);
    setDeviceStatus((prev) => ({ ...prev, [deviceId]: isAnyPotOn }));
    setActiveModal(null);
  };

  // 4. Loading State View
  if (loading) {
    return (
      <div className="min-h-screen bg-[#d1d9d4] flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="animate-spin text-[#2d5a1e]" size={40} />
          <p className="text-[#2d5a1e] font-medium">Loading your garden...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#d1d9d4] flex items-center justify-center p-4">
      <div className="bg-[#f4f7f4] rounded-[30px] shadow-2xl w-full max-w-[360px] min-h-[600px] flex flex-col border border-white/20 relative overflow-hidden">
        
        {/* Header */}
        <div className="p-6 flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="text-[#2d5a1e]">
            <ChevronLeft size={28} />
          </button>
          <h1 className="text-[#2d5a1e] text-2xl font-semibold">Garden Status</h1>
        </div>

        <div className="px-6 flex-1 space-y-6 overflow-y-auto pb-8">
          <h2 className="text-center text-[#2d5a1e] text-xl font-bold">My Garden</h2>

          {/* Health Summary */}
          <div className="bg-white rounded-2xl p-4 flex items-center gap-4 shadow-sm border border-[#2d5a1e]/10">
            <div className="bg-[#2d5a1e] p-2 rounded-full">
              <CheckCircle className="text-white" size={24} />
            </div>
            <div>
              <h3 className="text-[#2d5a1e] font-bold text-lg leading-tight">Plants are good!</h3>
              <p className="text-gray-500 text-[10px]">Soil is slightly moist, watering is paused.</p>
            </div>
          </div>

          {/* DYNAMIC DEVICE LIST */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#2d5a1e]/10 space-y-6">
            {config.map((device) => (
              <div key={device.device_id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-[#2d5a1e]">
                    <Settings2 size={24} />
                  </div>
                  <span className="text-[#2d5a1e] font-bold text-lg">
                    Device {device.device_id}: {deviceStatus[device.device_id] ? "On" : "Off"}
                  </span>
                </div>
                
                <button 
  onClick={() => toggleDevice(device.device_id)}
  className={`w-12 h-6 rounded-full transition-colors relative ${deviceStatus[device.device_id] ? 'bg-[#2d5a1e]' : 'bg-gray-300'}`}
>
  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${deviceStatus[device.device_id] ? 'left-7' : 'left-1'}`} />
</button>
              </div>
            ))}
            {config.length === 0 && <p className="text-center text-gray-400 text-sm">No devices found.</p>}
          </div>

          {/* Chatbot Toggle */}
          <button 
            onClick={() => navigate("/chatbot")}
            className="w-full bg-white rounded-2xl p-4 flex items-center gap-4 shadow-sm border border-[#2d5a1e]/10 active:scale-95 transition-all"
          >
            <div className="text-[#2d5a1e]">
              <MessageSquare size={32} />
            </div>
            <span className="text-[#2d5a1e] font-bold text-lg">Click to talk to our Chatbot</span>
          </button>

          <button 
  onClick={() => navigate("/dashboard")}
  className="w-full flex items-center justify-center gap-2 text-gray-400 text-sm hover:text-[#2d5a1e] transition-colors pb-4 mt-auto"
>
  <BarChart3 size={16} />
  <span className="underline">View Dashboard</span>
</button>
        </div>

        {/* DYNAMIC MODAL FOR POT SELECTION */}
        {activeModal && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center p-6 z-50">
            <div className="bg-white w-full rounded-[25px] p-6 shadow-2xl animate-in zoom-in-95 duration-200">
              <h3 className="text-[#2d5a1e] font-bold text-center mb-6">
                Select pots to pause watering for <br/>
                <span className="text-xs font-normal text-gray-500">(Device {activeModal})</span>
              </h3>
              
              <div className="grid grid-cols-1 gap-3 mb-8 max-h-60 overflow-y-auto pr-2">
                {Object.keys(potStatus)
                  .filter(key => key.startsWith(`d${activeModal}-`))
                  .map((potId, index) => (
                    <div key={potId} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <span className="text-[#2d5a1e] font-bold">Pot {index + 1}</span>
                      <button 
  onClick={() => handlePotToggle(potId)}
  className={`w-10 h-5 rounded-full transition-colors relative ${potStatus[potId] ? 'bg-[#2d5a1e]' : 'bg-gray-300'}`}
>
  {/* Corrected: On (true) is left-5.5 (right), Off (false) is left-0.5 (left) */}
  <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${potStatus[potId] ? 'left-5.5' : 'left-0.5'}`} />
</button>
                    </div>
                  ))}
              </div>

              <button 
                onClick={() => confirmDeviceOff(activeModal)}
                className="w-full bg-[#2d5a1e] text-white font-bold py-3 rounded-xl shadow-lg active:scale-95 transition-transform"
              >
                Confirm
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}