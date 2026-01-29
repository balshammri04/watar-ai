// src/components/CallDetails.jsx

export default function CallDetails({ call, onClose }) {
  // نفلتر الترانسكربت: فقط user + assistant
  const transcript = Array.isArray(call.transcript)
    ? call.transcript.filter(
        msg => msg.role === "user" || msg.role === "assistant"
      )
    : [];

  return (
    <div className="drawer-backdrop">
      <div className="drawer">
        <button
          className="drawer-close"
          onClick={onClose}
          aria-label="Close"
        >
          ✕
        </button>

        <h3>Conversation</h3>

        {transcript.length === 0 ? (
          <p className="empty">No conversation recorded</p>
        ) : (
          <div className="conversation">
            {transcript.map((msg, i) => (
              <div
                key={i}
                className={`bubble ${msg.role}`}
              >
                <span className="bubble-role">
                  {msg.role === "user" ? "User" : "Assistant"}
                </span>
                <p className="bubble-text">{msg.text}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}




// export default function CallDetails({ call, onClose }) {
//   // 🧠 تأكدنا من نوع المحتوى
//   const transcript =
//     Array.isArray(call.transcript)
//       ? call.transcript
//       : typeof call.transcript === "string"
//       ? [{ role: "user", text: call.transcript }]
//       : [];

//   return (
//     <div className="drawer-backdrop">
//       <div className="drawer">
//         <button className="drawer-close" onClick={onClose}>
//           ✕
//         </button>

//         <h3>Call Details</h3>

//         <p><b>From:</b> {call.from_number}</p>
//         <p><b>To:</b> {call.to_number}</p>
//         <p><b>Status:</b> {call.status}</p>
//         <p><b>Duration:</b> {call.duration ? `${call.duration}s` : "-"}</p>

//         <hr />

//         <h4>Conversation</h4>

//         {transcript.length === 0 ? (
//           <p className="empty">No conversation recorded</p>
//         ) : (
//           <div className="conversation">
//             {transcript.map((msg, i) => (
//               <div
//                 key={i}
//                 className={`bubble ${msg.role}`}
//               >
//                 <b>{msg.role}:</b> {msg.text}
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
