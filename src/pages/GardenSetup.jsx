import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ChevronLeft, Calendar as CalendarIcon, Leaf, ChevronDown } from "lucide-react";
import { deviceAPI } from "../api";

const PLANT_OPTIONS = ["Mint", "Tomato", "Basil", "Coriander", "Curry Leaves"];

export default function GardenSetup() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  const config = location.state?.device_configs || [{ device_id: 1, pot_count: 1 }];

  // State for selections and specifically which dropdown is open
  const [selections, setSelections] = useState({});
  const [openDropdown, setOpenDropdown] = useState(null); // Track which pot's dropdown is open
  const [activePicker, setActivePicker] = useState(null); // Keep this for the Date Picker modal

  const handlePlantSelect = (id, plant) => {
    setSelections(prev => ({
      ...prev,
      [id]: { ...prev[id], plant: plant }
    }));
    setOpenDropdown(null); // Close dropdown after selection
  };

  const handleDateSelect = (id, date) => {
    setSelections(prev => ({
      ...prev,
      [id]: { ...prev[id], date: date }
    }));
    setActivePicker(null);
  };

  const handleContinue = async () => {
  setLoading(true);
  try {
    const payload = Object.keys(selections).map(key => ({
      pot_id: key,
      plant_type: selections[key].plant,
      sowing_date: selections[key].date
    }));

    await deviceAPI.saveGardenDetails(payload);
    navigate("/garden-status", { state: { device_configs: config } });
  } catch (err) {
    console.error(err);
    // FORCED NAVIGATION FOR TESTING ONLY
    alert("API Failed, but navigating for testing...");
    navigate("/garden-status", { state: { device_configs: config } });
  } finally {
    setLoading(false);
  }
};

  const isFormComplete = config.every(device => 
  Array.from({ length: device.pot_count }).every((_, i) => {
    const id = `d${device.device_id}-p${i + 1}`;
    return selections[id]?.plant && selections[id]?.date;
  })
);

  return (
    <div className="min-h-screen bg-[#d1d9d4] flex items-center justify-center p-4">
      <div className="bg-[#f4f7f4] rounded-[30px] shadow-2xl w-full max-w-[360px] min-h-[600px] flex flex-col border border-white/20 relative overflow-hidden">
        
        {/* Header */}
        <div className="p-6 flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="text-[#2d5a1e]">
            <ChevronLeft size={28} />
          </button>
          <h1 className="text-[#2d5a1e] text-2xl font-semibold">Garden Setup</h1>
        </div>

        <div className="px-6 flex-1 overflow-y-auto pb-24">
          <div className="text-center mb-6">
            <h2 className="text-[#2d5a1e] text-xl font-bold">What are you growing?</h2>
            <p className="text-gray-600 text-xs">Select your plant and pot details</p>
          </div>

          {config.map((device) => (
            <div key={device.device_id} className="bg-white rounded-2xl p-4 mb-6 shadow-sm border border-gray-100">
              <h3 className="text-[#2d5a1e] font-bold mb-3 border-b pb-2">Device {device.device_id}</h3>
              
              <div className="space-y-4">
                {Array.from({ length: device.pot_count }).map((_, i) => {
                  const potId = `d${device.device_id}-p${i + 1}`;
                  return (
                    <div key={potId} className="flex flex-col gap-2 p-2 border-b border-gray-50 last:border-0">
                      <span className="text-[#2d5a1e] text-xs font-bold uppercase tracking-wider">Pot {i + 1}</span>
                      
                      <div className="flex gap-2 relative">
                        {/* PLANT DROPDOWN */}
                        <div className="flex-1 relative">
                          <button 
                            onClick={() => setOpenDropdown(openDropdown === potId ? null : potId)}
                            className="w-full flex items-center justify-between bg-[#f0f4f0] border border-[#2d5a1e]/20 rounded-lg px-3 py-2 text-xs text-gray-700"
                          >
                            <div className="flex items-center gap-2">
                              <Leaf size={14} className="text-[#2d5a1e]" />
                              {selections[potId]?.plant || "Select Plant"}
                            </div>
                            <ChevronDown size={14} className={`transition-transform ${openDropdown === potId ? 'rotate-180' : ''}`} />
                          </button>

                          {/* DROPDOWN MENU */}
                          {openDropdown === potId && (
                            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 shadow-xl rounded-xl z-50 py-1 max-h-40 overflow-y-auto">
                              {PLANT_OPTIONS.map((plant) => (
                                <button
                                  key={plant}
                                  onClick={() => handlePlantSelect(potId, plant)}
                                  className="w-full text-left px-4 py-2 text-sm hover:bg-[#f0f4f0] text-gray-700 active:bg-[#2d5a1e] active:text-white"
                                >
                                  {plant}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* DATE SELECTOR */}
                        <button 
                          onClick={() => setActivePicker({ id: potId, type: 'date' })}
                          className="flex items-center gap-2 bg-[#f0f4f0] border border-[#2d5a1e]/20 rounded-lg px-3 py-2 text-xs text-gray-700"
                        >
                          <CalendarIcon size={14} className="text-[#2d5a1e]" />
                          {selections[potId]?.date || "Date"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer Button */}
        <div className="p-6 bg-[#f4f7f4] border-t border-gray-100">
          <button
            onClick={handleContinue}
            disabled={loading || !isFormComplete}
            className={`w-full bg-[#2d5a1e] hover:bg-[#244a18] text-white rounded-full py-3 shadow-lg transition-all active:scale-95 ${(!isFormComplete || loading) ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <span className="text-lg font-bold uppercase tracking-wide">
              {loading ? "Saving..." : "Continue"}
            </span>
          </button>
        </div>

        {/* Date Picker Modal (Keep as modal for better mobile date input) */}
        {activePicker && activePicker.type === 'date' && (
          <div className="absolute inset-0 bg-black/40 flex items-end justify-center z-[60]">
            <div className="bg-white w-full rounded-t-[30px] p-6 animate-in slide-in-from-bottom duration-300">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-[#2d5a1e]">Select Sowing Date</h3>
                <button onClick={() => setActivePicker(null)} className="text-gray-400 font-bold">Close</button>
              </div>
              <input 
                type="date" 
                onChange={(e) => handleDateSelect(activePicker.id, e.target.value)}
                className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2d5a1e]/20"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}