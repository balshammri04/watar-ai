// App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import ProtectedRoute from "./auth/ProtectedRoute";

// Admin
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import TeamMembers from "./pages/admin/TeamMembers";
import AdminLogs from "./pages/admin/Logs";
import AdminCalls from "./pages/admin/Calls";

// 🆕 Staff
import StaffLayout from "./layouts/StaffLayout";
import StaffDashboard from "./pages/staff/StaffDashboard";
import Patients from "./pages/staff/Patients";
import Appointments from "./pages/staff/Appointments";
import StaffCalls from "./pages/staff/Calls";

function UserHome() {
  return <h2>User Dashboard</h2>;
}

export default function App() {
  return (
    <Routes>
      {/* Login */}
      <Route path="/login" element={<Login />} />

      {/* Admin */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute role="admin">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="team" element={<TeamMembers />} />
        <Route path="logs" element={<AdminLogs />} />
        <Route path="calls" element={<AdminCalls />} /> 
      </Route>

      {/* Staff ✅ */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute role="staff">
            <StaffLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<StaffDashboard />} />
        <Route path="patients" element={<Patients />} />
        <Route path="appointments" element={<Appointments />} />
        <Route path="calls" element={<StaffCalls />} />
      </Route>

      {/* Default */}
      <Route path="/" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
