import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { cropsAPI, sensorsAPI, recommendationsAPI } from "../api";

export default function FieldStatus() {
  const navigate = useNavigate();
  const [crops, setCrops] = useState([]);
  const [sensors, setSensors] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) { navigate("/"); return; }
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const [c, s, r] = await Promise.all([
        cropsAPI.getUserCrops(),
        sensorsAPI.getLatest(),
        recommendationsAPI.getHistory(),
      ]);
      setCrops(Array.isArray(c) ? c : []);
      setSensors(s);
      setRecommendations(Array.isArray(r) ? r.slice(0, 5) : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="text-green-600">Loading...</div></div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-green-700 text-white px-6 py-4 flex items-center gap-3">
        <button onClick={() => navigate("/dashboard")} className="text-white">←</button>
        <h1 className="text-xl font-bold">Field Status</h1>
      </nav>
      <div className="p-4 max-w-2xl mx-auto space-y-4">
        
        {/* Crops */}
        <div className="bg-white rounded-xl shadow p-4">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">My Crops</h2>
          {crops.length > 0 ? crops.map((crop, i) => (
            <div key={i} className="border-b last:border-0 py-2">
              <p className="font-medium text-green-700">{crop.crop_name}</p>
              <p className="text-sm text-gray-500">Area: {crop.area_acres} acres | Soil: {crop.soil_type}</p>
              {crop.sowing_date && <p className="text-xs text-gray-400">Sowed: {crop.sowing_date}</p>}
            </div>
          )) : <p className="text-gray-400 text-sm">No crops added yet</p>}
        </div>

        {/* Sensors */}
        {sensors && (
          <div className="bg-white rounded-xl shadow p-4">
            <h2 className="text-lg font-semibold text-gray-700 mb-3">Current Readings</h2>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="bg-blue-50 rounded p-2"><span className="text-gray-500">Moisture: </span><strong>{sensors.soil_moisture}%</strong></div>
              <div className="bg-green-50 rounded p-2"><span className="text-gray-500">Temp: </span><strong>{sensors.temperature}°C</strong></div>
              <div className="bg-yellow-50 rounded p-2"><span className="text-gray-500">Humidity: </span><strong>{sensors.humidity}%</strong></div>
              <div className="bg-purple-50 rounded p-2"><span className="text-gray-500">Rain: </span><strong>{sensors.rainfall} mm</strong></div>
            </div>
          </div>
        )}

        {/* Recommendation History */}
        <div className="bg-white rounded-xl shadow p-4">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">Recent Recommendations</h2>
          {recommendations.length > 0 ? recommendations.map((r, i) => (
            <div key={i} className="border-b last:border-0 py-2">
              <span className={`text-xs px-2 py-0.5 rounded-full ${r.action === "irrigate" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"}`}>
                {r.action}
              </span>
              {r.message && <p className="text-sm text-gray-600 mt-1">{r.message}</p>}
              {r.created_at && <p className="text-xs text-gray-400">{new Date(r.created_at).toLocaleDateString()}</p>}
            </div>
          )) : <p className="text-gray-400 text-sm">No recommendations yet</p>}
        </div>
      </div>
    </div>
  );
}