import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { sensorsAPI, recommendationsAPI, usersAPI, authAPI } from "../api";

export default function Dashboard() {
  const navigate = useNavigate();
  const [sensorData, setSensorData] = useState(null);
  const [recommendation, setRecommendation] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) { navigate("/"); return; }
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [me, sensors, rec] = await Promise.all([
        usersAPI.getMe(),
        sensorsAPI.getLatest(),
        recommendationsAPI.getLatest(),
      ]);
      setUser(me);
      setSensorData(sensors);
      setRecommendation(rec);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    authAPI.logout();
    navigate("/");
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-green-600 text-lg">Loading...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-green-700 text-white px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">AquaSense</h1>
        <div className="flex gap-4 items-center">
          <span className="text-sm">{user?.name || "Farmer"}</span>
          <button onClick={handleLogout} className="text-sm underline">Logout</button>
        </div>
      </nav>

      <div className="p-4 max-w-2xl mx-auto space-y-4">
        {error && <p className="text-red-500 text-sm">{error}</p>}

        {/* Sensor Card */}
        <div className="bg-white rounded-xl shadow p-4">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">Field Sensors</h2>
          {sensorData ? (
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-blue-50 rounded-lg p-3">
                <p className="text-xs text-gray-500">Soil Moisture</p>
                <p className="text-2xl font-bold text-blue-600">{sensorData.soil_moisture ?? "--"}%</p>
              </div>
              <div className="bg-green-50 rounded-lg p-3">
                <p className="text-xs text-gray-500">Temperature</p>
                <p className="text-2xl font-bold text-green-600">{sensorData.temperature ?? "--"}°C</p>
              </div>
              <div className="bg-yellow-50 rounded-lg p-3">
                <p className="text-xs text-gray-500">Humidity</p>
                <p className="text-2xl font-bold text-yellow-600">{sensorData.humidity ?? "--"}%</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-3">
                <p className="text-xs text-gray-500">Rainfall</p>
                <p className="text-2xl font-bold text-purple-600">{sensorData.rainfall ?? "--"} mm</p>
              </div>
            </div>
          ) : (
            <p className="text-gray-400 text-sm">No sensor data available</p>
          )}
        </div>

        {/* Recommendation Card */}
        <div className="bg-white rounded-xl shadow p-4">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">Irrigation Recommendation</h2>
          {recommendation ? (
            <div>
              <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-2 ${
                recommendation.action === "irrigate"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-green-100 text-green-700"
              }`}>
                {recommendation.action === "irrigate" ? "💧 Irrigate Now" : "✅ No Irrigation Needed"}
              </div>
              {recommendation.message && (
                <p className="text-gray-600 text-sm">{recommendation.message}</p>
              )}
              {recommendation.water_required && (
                <p className="text-sm text-gray-500 mt-1">
                  Water required: <strong>{recommendation.water_required} mm</strong>
                </p>
              )}
            </div>
          ) : (
            <p className="text-gray-400 text-sm">No recommendation available</p>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => navigate("/field-status")}
            className="bg-white rounded-xl shadow p-4 text-left hover:shadow-md transition"
          >
            <p className="text-green-600 text-2xl mb-1">🌱</p>
            <p className="font-semibold text-gray-700">Field Status</p>
          </button>
          <button
            onClick={() => navigate("/chatbot")}
            className="bg-white rounded-xl shadow p-4 text-left hover:shadow-md transition"
          >
            <p className="text-blue-600 text-2xl mb-1">💬</p>
            <p className="font-semibold text-gray-700">Ask AI</p>
          </button>
        </div>
      </div>
    </div>
  );
}