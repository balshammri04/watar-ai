// src/components/CallTable.jsx

function formatDuration(seconds, status) {
  if (status === "in_progress") return "Live ⏱";
  if (seconds == null) return "-";

  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

export default function CallTable({ calls, onView }) {
  return (
    <div className="panel calls-panel">
      <table className="table">
        <thead>
          <tr>
            <th>Call SID</th>
            <th>Date</th>
            <th>Time</th>
            <th>Status</th>
            <th>Direction</th>
            <th>From</th>
            <th>To</th>
            <th>Duration</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {calls.map(call => {
            const date = new Date(call.start_time);

            return (
              <tr key={call.id}>
                <td className="mono">{call.call_sid}</td>

                <td>{date.toLocaleDateString()}</td>
                <td>{date.toLocaleTimeString()}</td>

                <td>
                  <span className={`pill ${call.status}`}>
                    {call.status}
                  </span>
                </td>

                <td>{call.direction}</td>
                <td>{call.from_number}</td>
                <td>{call.to_number}</td>

                <td>
                  {formatDuration(call.duration_seconds, call.status)}
                </td>

                <td>
                  <button
                    className="icon-btn"
                    onClick={() => onView(call)}
                    title="View conversation"
                  >
                    View
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}



// function formatDuration(seconds, status) {
//   if (status === "in_progress") return "Live ⏱";
//   if (seconds == null) return "-";

//   const m = Math.floor(seconds / 60);
//   const s = seconds % 60;
//   return m > 0 ? `${m}m ${s}s` : `${s}s`;
// }

// export default function CallTable({ calls, onView }) {
//   return (
//     <table className="logs-table">
//       <thead>
//         <tr>
//           <th>Time</th>
//           <th>From</th>
//           <th>To</th>
//           <th>Type</th>
//           <th>Status</th>
//           <th>Duration</th>
//           <th></th>
//         </tr>
//       </thead>

//       <tbody>
//         {calls.map(call => (
//           <tr key={call.id}>
//             <td>{new Date(call.time).toLocaleString()}</td>
//             <td>{call.from_number}</td>
//             <td>{call.to_number}</td>
//             <td>{call.direction}</td>
//             <td>
//               <span className={`status ${call.status}`}>
//                 {call.status_display || call.status}
//               </span>
//             </td>
//             <td>{formatDuration(call.duration, call.status)}</td>
//             <td>
//               <button
//                 className="btn btn-link"
//                 onClick={() => onView(call)}
//               >
//                 👁 View
//               </button>
//             </td>
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   );
// }


