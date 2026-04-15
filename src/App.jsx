import { Routes, Route, Navigate } from "react-router-dom";
import GetStarted from "./pages/GetStarted";
import RegisterChoice from "./pages/RegisterChoice";
import DeviceSetup from "./pages/DeviceSetup";
import GardenSetup from "./pages/GardenSetup"; // Import the new page
import GardenStatus from "./pages/GardenStatus";
import Dashboard from "./pages/Dashboard";

import Chatbot from "./pages/chatbot";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("access_token");
  return token ? children : <Navigate to="/" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<GetStarted />} />
      <Route path="/register-choice" element={<RegisterChoice />} />
      <Route path="/device-setup" element={<DeviceSetup />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
     // App.jsx
    //<Route path="/garden-setup" element={<GardenSetup />} /> {/* Remove ProtectedRoute here */}
    //<Route path="/garden-status" element={<GardenStatus />} />
      <Route path="/garden-setup" element={<ProtectedRoute><GardenSetup /></ProtectedRoute>} />
      <Route path="/garden-status" element={<ProtectedRoute><GardenStatus /></ProtectedRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/chatbot" element={<ProtectedRoute><Chatbot /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}