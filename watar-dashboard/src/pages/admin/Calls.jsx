// Calls.jsx 
// Admin view for managing and viewing calls
import { useEffect, useState } from "react";
import { getCalls } from "../../api/calls";
import CallTable from "../../components/CallTable";
import CallDetails from "../../components/CallDetails";

export default function Calls() {
  const [calls, setCalls] = useState([]);
  const [selectedCall, setSelectedCall] = useState(null);

  useEffect(() => {
    getCalls()
      .then(setCalls)
      .catch(console.error);
  }, []);

  return (
    <div className="content">
      <CallTable
        calls={calls}
        onView={setSelectedCall}
      />

      {selectedCall && (
        <CallDetails
          call={selectedCall}
          onClose={() => setSelectedCall(null)}
        />
      )}
    </div>
  );
}

// import { useEffect, useState } from "react";
// import { getCalls } from "../../api/calls";
// import CallDetails from "../../components/CallDetails";

// function formatDuration(seconds, status) {
//   if (status === "in_progress") return "Live ⏱";
//   if (seconds == null) return "-";

//   const m = Math.floor(seconds / 60);
//   const s = seconds % 60;
//   return m > 0 ? `${m}m ${s}s` : `${s}s`;
// }

// export default function Calls() {
//   const [calls, setCalls] = useState([]);
//   const [selectedCall, setSelectedCall] = useState(null);

//   useEffect(() => {
//     getCalls()
//       .then(setCalls)
//       .catch(console.error);
//   }, []);

//   return (
//     <div className="content">
//       {/* ⬇️ نفس Logs بالضبط */}
//       <div className="panel calls-panel">
//         <table className="table team-members__table">
//           <thead>
//             <tr>
//               <th>Time</th>
//               <th>Call SID</th>
//               <th>Status</th>
//               <th>Direction</th>
//               <th>From</th>
//               <th>Duration</th>
//               <th></th>
//             </tr>
//           </thead>

//           <tbody>
//             {calls.map(call => {
//               const date = new Date(call.start_time);

//               return (
//                 <tr key={call.id}>
//                   <td>{date.toLocaleString()}</td>

//                   <td className="mono">{call.call_sid}</td>

//                   <td>
//                     <span className={`pill ${call.status}`}>
//                       {call.status}
//                     </span>
//                   </td>

//                   <td>{call.direction}</td>

//                   <td>{call.caller_number}</td>

//                   <td>
//                     {formatDuration(call.duration_seconds, call.status)}
//                   </td>

//                   <td>
//                     <button
//                       className="icon-btn"
//                       onClick={() => setSelectedCall(call)}
//                     >
//                       View
//                     </button>
//                   </td>
//                 </tr>
//               );
//             })}
//           </tbody>
//         </table>
//       </div>

//       {selectedCall && (
//         <CallDetails
//           call={selectedCall}
//           onClose={() => setSelectedCall(null)}
//         />
//       )}
//     </div>
//   );
// }






