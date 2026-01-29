// AdminLayout.jsx
import {
  NavLink,
  Outlet,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const location = useLocation();

  const onLogout = () => {
    logout();
    nav("/login");
  };

  /* =========================
     Page Titles & Subtitles
  ========================= */
  const pageMeta = {
    "/admin": {
      title: "Dashboard 👋",
      subtitle: "Overview & system activity",
    },
    "/admin/team": {
      title: "Team Members",
      subtitle: "Manage staff accounts",
    },
    "/admin/logs": {
      title: "System Logs",
      subtitle: "Admin activity & security events",
    },
    "/admin/calls": {
      title: "Calls",
      subtitle: "Call records & history",
    },
  };

  const currentPage =
    pageMeta[location.pathname] || pageMeta["/admin"];

  return (
    <div className="app-shell">
      {/* ================= Sidebar ================= */}
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-logo">⚡</div>
          <div>
            <div className="brand-name">WATAR AI</div>
            <div className="brand-sub">Admin Panel</div>
          </div>
        </div>

        <nav className="menu">
          <NavLink to="/admin" end className="menu-item">
            Dashboard
          </NavLink>

          <NavLink to="/admin/team" className="menu-item">
            Team Members
          </NavLink>

          <NavLink to="/admin/logs" className="menu-item">
            Logs
          </NavLink>

          <NavLink to="/admin/calls" className="menu-item">
            Calls
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <div className="mini-user">
            <div className="avatar">
              {(user?.name || "A")[0]}
            </div>
            <div className="mini-user-meta">
              <div className="mini-user-name">
                {user?.name || "Admin"}
              </div>
              <div className="mini-user-email">
                {user?.email}
              </div>
            </div>
          </div>

          <button
            className="btn btn-ghost"
            onClick={onLogout}
          >
            Logout
          </button>
        </div>
      </aside>

      {/* ================= Main ================= */}
      <main className="main">
        {/* Topbar */}
        <div className="topbar">
          <div>
            <h2 className="page-title">
              {currentPage.title}
            </h2>
            <p className="page-subtitle">
              {currentPage.subtitle}
            </p>
          </div>
        </div>

        {/* Page content */}
        <Outlet />
      </main>
    </div>
  );
}

