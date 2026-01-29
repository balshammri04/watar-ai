// src/pages/staff/StaffDashboard.jsx
import { useEffect, useState } from "react";
import { getStaffSummary } from "../../api/staff";

export default function StaffDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    setLoading(true);
    getStaffSummary()
      .then(setData)
      .catch((e) => {
  console.error("STAFF SUMMARY ERROR:", e?.response?.status, e?.response?.data, e);
  setErr("Failed to load dashboard");
})

      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="content">Loading dashboard…</div>;
  }

  if (err) {
    return <div className="content error">{err}</div>;
  }

  return (
    <div className="dashboard">
      {/* ===== Topbar (نفس الأدمن) ===== */}
      <div className="topbar">
        <div>
          <h2 className="page-title">Dashboard 👋</h2>
          <p className="page-subtitle">Staff overview</p>
        </div>
      </div>

      {/* ===== Cards (نفس spacing الأدمن) ===== */}
      <div className="cards-grid">
        <div className="card">
          <div className="card-label">Handoff Calls Today</div>
          <div className="card-value">
            {data.handoff_calls_today}
          </div>
        </div>

        <div className="card">
          <div className="card-label">Booked Today</div>
          <div className="card-value">
            {data.booked_today}
          </div>
        </div>
      </div>
    </div>
  );
}



// // StaffDashboard.jsx 
// import { useEffect, useState } from "react";
// import { getStaffSummary } from "../../api/staff";

// export default function StaffDashboard() {
//   const [data, setData] = useState(null);

//   useEffect(() => {
//     getStaffSummary().then(setData).catch(console.error);
//   }, []);

//   return (
//     <>
//       <div className="topbar">
//         <h2 className="page-title">Dashboard 👋</h2>
//         <p className="page-subtitle">Staff overview</p>
//       </div>

//       <div className="content">
//         <div className="cards">
//           <div className="card">
//             <div className="card-label">Handoff Calls Today</div>
//             <div className="card-value">
//               {data?.handoff_calls_today ?? "—"}
//             </div>
//           </div>

//           <div className="card">
//             <div className="card-label">Booked Today</div>
//             <div className="card-value">
//               {data?.booked_today ?? "—"}
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

