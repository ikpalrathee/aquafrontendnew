import { Routes, Route, Navigate } from "react-router-dom";
import GetStarted from "./pages/GetStarted";
import RegisterChoice from "./pages/RegisterChoice";
import DeviceSetup from "./pages/DeviceSetup";
import Dashboard from "./pages/Dashboard";
import FieldSetup from "./pages/FieldSetup";
import FieldStatus from "./pages/FieldStatus";
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
      <Route path="/field-setup" element={<ProtectedRoute><FieldSetup /></ProtectedRoute>} />
      <Route path="/field-status" element={<ProtectedRoute><FieldStatus /></ProtectedRoute>} />
      <Route path="/chatbot" element={<ProtectedRoute><Chatbot /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}