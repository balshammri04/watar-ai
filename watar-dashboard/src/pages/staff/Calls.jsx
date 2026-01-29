// pages/staff/Calls.jsx
import { useEffect, useState } from "react";
import { getStaffCalls } from "../../api/staff";
import CallTable from "../../components/CallTable";

export default function StaffCalls() {
  const [calls, setCalls] = useState([]);

  useEffect(() => {
    getStaffCalls()
      .then(setCalls)
      .catch(console.error);
  }, []);

  return (
    <>
      <div className="topbar">
        <div>
          <h2 className="page-title">Calls</h2>
          <p className="page-subtitle">Call records & history</p>
        </div>
      </div>

      {/* ===== Content ===== */}
      <div className="content">
        <CallTable calls={calls} />
      </div>
    </>
  );
}