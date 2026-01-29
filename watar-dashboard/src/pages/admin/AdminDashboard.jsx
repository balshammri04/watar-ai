// AdminDashboard.jsx
import { useEffect, useState } from "react";
import { getDashboardSummary } from "../../api/dashboard";

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    setLoading(true);
    getDashboardSummary()
      .then(setData)
      .catch((e) => {
        console.error(e);
        setErr("Failed to load dashboard");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="content">Loading dashboard…</div>;
  if (err) return <div className="content error">{err}</div>;

  return (
<div className="dashboard">
      {/* ===== Stats ===== */}
<div className="cards-grid">
        <Card label="Total Calls" value={data.calls.total} icon="📞" />
        <Card label="Calls Today" value={data.calls.today} icon="📅" />
        <Card label="Total Users" value={data.users.total} icon="👥" />
        <Card label="Admins" value={data.users.admins} icon="🛡️" />
        <Card label="Success Rate" value={`${data.calls.success_rate}%`} icon="✅" />
      </div>

      {/* ===== System Status ===== */}
      <section className="panel">
        <h3>System Health</h3>
        <p>
          Status:{" "}
          <b style={{ color: data.system.status === "ok" ? "green" : "orange" }}>
            {data.system.status.toUpperCase()}
          </b>
        </p>
        {data.system.last_error_at && (
          <p>
            Last error at:{" "}
            {new Date(data.system.last_error_at).toLocaleString()}
          </p>
        )}
      </section>
    </div>
  );
}

function Card({ label, value, icon }) {
  return (
    <div className="card">
      <div className="card-top">
        <div className="card-icon">{icon}</div>
        <div className="card-label">{label}</div>
      </div>
      <div className="card-value">{value}</div>
    </div>
  );
}
