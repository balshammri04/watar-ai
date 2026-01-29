// Appointments.jsx
import { useEffect, useState } from "react";
import api from "../../api";

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/appointments")
      .then(res => setAppointments(res.data.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      {/* ===== Topbar ===== */}
      <div className="topbar">
        <div>
          <h2 className="page-title">Appointments</h2>
          <p className="page-subtitle">From database (live)</p>
        </div>
      </div>

      {/* ===== Content ===== */}
      <div className="content">
        <div className="panel">
          {loading ? (
            <p>Loading appointments…</p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {appointments.map(a => (
                  <tr key={a.id}>
                    {/* Patient name from relation */}
                    <td>{a.Patient?.name || "—"}</td>

                    {/* Date from DB */}
                    <td>{a.appointment_date}</td>

                    {/* Time from DB */}
                    <td>{a.appointment_time}</td>

                    {/* Status with color */}
                    <td>
                      <span className={`pill ${a.status}`}>
                        {a.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}

// import { useEffect, useState } from "react";
// import api from "../../api";

// export default function Appointments() {
//   const [appointments, setAppointments] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     api.get("/appointments")
//       .then(res => setAppointments(res.data.data))
//       .finally(() => setLoading(false));
//   }, []);

//   return (
//     <>
//       {/* ===== Topbar ===== */}
//       <div className="topbar">
//         <div>
//           <h2 className="page-title">Appointments</h2>
//           <p className="page-subtitle">Scheduled visits</p>
//         </div>
//       </div>

//       {/* ===== Content ===== */}
//       <div className="content">
//         <div className="panel">
//           {loading ? (
//             <p>Loading appointments…</p>
//           ) : (
//             <table className="table">
//               <thead>
//                 <tr>
//                   <th>Patient</th>
//                   <th>Doctor</th>
//                   <th>Date</th>
//                   <th>Status</th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {appointments.map(a => (
//                   <tr key={a.id}>
//                     <td>{a.Patient?.name || "—"}</td>
//                     <td>{a.doctor || "—"}</td>
//                     <td>{new Date(a.date).toLocaleString()}</td>
//                     <td>
//                       <span className={`pill ${a.status}`}>
//                         {a.status}
//                       </span>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           )}
//         </div>
//       </div>
//     </>
//   );
// }