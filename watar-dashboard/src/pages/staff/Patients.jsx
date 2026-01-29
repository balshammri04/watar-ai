// Patients.jsx
import { useEffect, useState } from "react";
import api from "../../api";

export default function Patients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/patients")
      .then(res => setPatients(res.data.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      {/* ===== Topbar ===== */}
      <div className="topbar">
        <div>
          <h2 className="page-title">Patients</h2>
          <p className="page-subtitle">Registered patients</p>
        </div>
      </div>

      {/* ===== Content ===== */}
      <div className="content">
        <div className="panel">
          {loading ? (
            <p>Loading patients…</p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Phone</th>
                </tr>
              </thead>
              <tbody>
                {patients.map(p => (
                  <tr key={p.id}>
                    <td>{p.name}</td>
                    <td className="mono">{p.phone}</td>
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
