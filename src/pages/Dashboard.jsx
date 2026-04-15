import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { sensorsAPI, recommendationsAPI, usersAPI, authAPI } from "../api";
import { LogOut, Sprout, MessageSquare, ArrowLeft } from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();
  const [sensorData, setSensorData] = useState(null);
  const [recommendation, setRecommendation] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) { 
      navigate("/", { replace: true }); 
      return; 
    }
    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Promise.all handles multiple requests in parallel for better speed
      const [me, sensors, rec] = await Promise.all([
        usersAPI.getMe(),
        sensorsAPI.getLatest(),
        recommendationsAPI.getLatest(),
      ]);
      setUser(me);
      setSensorData(sensors);
      setRecommendation(rec);
    } catch (err) {
      setError("Failed to fetch latest data. Please check your connection.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    authAPI.logout();
    navigate("/", { replace: true });
  };

  if (loading) return (
    <div className="min-h-screen bg-[#f4f7f4] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-4 border-[#2d5a1e] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-[#2d5a1e] font-medium">Loading AquaSense...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#d1d9d4]">
      {/* Header */}
      <nav className="bg-[#2d5a1e] text-white px-6 py-4 flex justify-between items-center shadow-md">
        <div className="flex items-center gap-3">
           <button onClick={() => navigate("/garden-status")} className="hover:bg-white/10 p-1 rounded">
             <ArrowLeft size={20} />
           </button>
           <h1 className="text-xl font-bold tracking-tight">AquaSense</h1>
        </div>
        <div className="flex gap-4 items-center">
          <span className="text-sm font-medium">Hello, {user?.name || "Farmer"}</span>
          <button onClick={handleLogout} className="hover:text-red-200 transition-colors">
            <LogOut size={20} />
          </button>
        </div>
      </nav>

      <div className="p-4 max-w-2xl mx-auto space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
            {error}
          </div>
        )}

        {/* Sensor Card */}
        <div className="bg-white rounded-3xl shadow-sm p-6 border border-[#2d5a1e]/10">
          <h2 className="text-lg font-bold text-[#2d5a1e] mb-4">Live Field Sensors</h2>
          {sensorData ? (
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
                <p className="text-[10px] uppercase font-bold text-blue-400 mb-1">Soil Moisture</p>
                <p className="text-2xl font-black text-blue-600">{sensorData.soil_moisture ?? "--"}%</p>
              </div>
              <div className="bg-orange-50 rounded-2xl p-4 border border-orange-100">
                <p className="text-[10px] uppercase font-bold text-orange-400 mb-1">Temperature</p>
                <p className="text-2xl font-black text-orange-600">{sensorData.temperature ?? "--"}°C</p>
              </div>
              <div className="bg-cyan-50 rounded-2xl p-4 border border-cyan-100">
                <p className="text-[10px] uppercase font-bold text-cyan-400 mb-1">Humidity</p>
                <p className="text-2xl font-black text-cyan-600">{sensorData.humidity ?? "--"}%</p>
              </div>
              <div className="bg-purple-50 rounded-2xl p-4 border border-purple-100">
                <p className="text-[10px] uppercase font-bold text-purple-400 mb-1">Rainfall</p>
                <p className="text-2xl font-black text-purple-600">{sensorData.rainfall ?? "--"}mm</p>
              </div>
            </div>
          ) : (
            <p className="text-gray-400 text-sm italic text-center py-4">Waiting for device data...</p>
          )}
        </div>

        {/* Recommendation Card */}
        <div className="bg-white rounded-3xl shadow-sm p-6 border border-[#2d5a1e]/10">
          <h2 className="text-lg font-bold text-[#2d5a1e] mb-4">AI Recommendation</h2>
          {recommendation ? (
            <div className="space-y-3">
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold ${
                recommendation.action === "irrigate"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-green-100 text-green-700"
              }`}>
                {recommendation.action === "irrigate" ? "💧 Action: Irrigate" : "✅ Action: No Irrigation"}
              </div>
              {recommendation.message && (
                <p className="text-gray-600 text-sm leading-relaxed">{recommendation.message}</p>
              )}
              {recommendation.water_required > 0 && (
                <div className="pt-2 border-t border-gray-50">
                  <p className="text-xs text-gray-500">
                    Target Volume: <span className="font-bold text-gray-700">{recommendation.water_required} mm</span>
                  </p>
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-400 text-sm italic text-center py-4">Generating AI insights...</p>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => navigate("/garden-status")}
            className="bg-white rounded-3xl shadow-sm p-5 text-left hover:border-[#2d5a1e]/30 border border-transparent transition-all active:scale-95"
          >
            <div className="bg-[#2d5a1e]/10 w-10 h-10 rounded-full flex items-center justify-center mb-3">
              <Sprout className="text-[#2d5a1e]" size={20} />
            </div>
            <p className="font-bold text-[#2d5a1e]">My Garden</p>
            <p className="text-[10px] text-gray-400">View plant health</p>
          </button>
          
          <button
            onClick={() => navigate("/chatbot")}
            className="bg-white rounded-3xl shadow-sm p-5 text-left hover:border-[#2d5a1e]/30 border border-transparent transition-all active:scale-95"
          >
            <div className="bg-blue-50 w-10 h-10 rounded-full flex items-center justify-center mb-3">
              <MessageSquare className="text-blue-600" size={20} />
            </div>
            <p className="font-bold text-gray-800">Ask AI</p>
            <p className="text-[10px] text-gray-400">Chat with AquaSense</p>
          </button>
        </div>
      </div>
    </div>
  );
}