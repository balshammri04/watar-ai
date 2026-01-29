// StaffLayout.jsx
import { Outlet, NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function StaffLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="app-shell">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-logo">⚡</div>
          <div>
            <div className="brand-name">WATAR AI</div>
            <div className="brand-sub">Staff Panel</div>
          </div>
        </div>

        <nav className="menu">
          <NavLink to="/dashboard" end className="menu-item">Dashboard</NavLink>
          <NavLink to="/dashboard/patients" className="menu-item">Patients</NavLink>
          <NavLink to="/dashboard/appointments" className="menu-item">Appointments</NavLink>
          <NavLink to="/dashboard/calls" className="menu-item">Calls</NavLink>
        </nav>

        <div className="sidebar-footer">
          <div className="mini-user">
            <div className="avatar">
              {user?.email?.[0]?.toUpperCase()}
            </div>
            <div className="mini-user-meta">
              <div className="mini-user-name">{user?.email}</div>
              <div className="mini-user-email">staff</div>
            </div>
          </div>

          <button className="btn btn-ghost" onClick={logout}>
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="main">
        <Outlet />
      </main>
    </div>
  );
}
