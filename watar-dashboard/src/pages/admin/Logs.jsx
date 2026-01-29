// src/pages/admin/Logs.jsx
import { useEffect, useState } from "react";
import { getLogs } from "../../api/logs";

export default function Logs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLogs()
      .then(setLogs)
      .finally(() => setLoading(false));
  }, []);

  const formatAction = (log) => {
    const { action, endpoint } = log;

    if (action === "POST" && endpoint.includes("/users"))
      return { label: "Create user", type: "create" };

    if (action === "DELETE" && endpoint.includes("/users"))
      return { label: "Delete user", type: "delete" };

    if (action === "POST" && endpoint.includes("/auth/login"))
      return { label: "Login", type: "login" };

    if (action === "POST" && endpoint.includes("/auth/logout"))
      return { label: "Logout", type: "logout" };

    if (action === "GET")
      return { label: "View data", type: "view" };

    if (action === "HEAD")
      return { label: "System check", type: "system" };

    return { label: action, type: "default" };
  };

  return (
    <div className="content">
      {/* ⬇️ نفس panel حق Team Members لكن مع class إضافية */}
      <div className="panel logs-panel">
        {loading ? (
          <p>Loading logs...</p>
        ) : (
<table className="table team-members__table">
            <thead>
              <tr>
                <th>Time</th>
                <th>User</th>
                <th>Action</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {logs.map((log) => {
                const action = formatAction(log);

                return (
                  <tr key={log.id}>
                    <td>{new Date(log.createdAt).toLocaleString()}</td>
                    <td>{log.User?.email || <span className="muted">System</span>}</td>
                    <td>
                      <span className={`pill ${action.type}`}>
                        {action.label}
                      </span>
                    </td>
                    <td>
                      <span className={`pill ${log.status}`}>
                        {log.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}



