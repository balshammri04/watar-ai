// src/pages/admin/TeamMembers.jsx
import { useEffect, useState } from "react";
import { getUsers, createUser, deleteUser } from "../../api/users";
import { useAuth } from "../../auth/AuthContext";

export default function TeamMembers() {
  const { user: currentUser } = useAuth();

  const [users, setUsers] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "staff",
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    const data = await getUsers();
    setUsers(data);
    setLoading(false);
  };

  const onCreate = async () => {
    if (!form.name || !form.email || !form.password) {
      alert("Please fill all fields");
      return;
    }

    await createUser(form);
    setForm({ name: "", email: "", password: "", role: "staff" });
    setShowCreate(false);
    loadUsers();
  };

  const onDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    await deleteUser(id);
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  return (
    <div className="content team-members">
      {/* ===== Header (زر فقط) ===== */}
      <div className="team-members__header">
        {currentUser?.role === "admin" && (
          <button className="btn" onClick={() => setShowCreate(!showCreate)}>
            + Add 
          </button>
        )}
      </div>

      {/* ===== Create User ===== */}
      {showCreate && (
        <div className="panel team-members__create">
          <h4>Create New User</h4>

          <div className="team-members__form">
            <input
              placeholder="Full name"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />
            <input
              placeholder="Email"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
            />
            <input
              type="password"
              placeholder="Temporary password"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
            />
            <select
              value={form.role}
              onChange={(e) =>
                setForm({ ...form, role: e.target.value })
              }
            >
              <option value="staff">Staff</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="team-members__actions">
            <button className="btn" onClick={onCreate}>
              Create
            </button>
          </div>
        </div>
      )}

      {/* ===== Users Table ===== */}
      <div className="panel">
        {loading ? (
          <p>Loading users...</p>
        ) : (
          <table className="table team-members__table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Created</th>
                <th style={{ width: 120 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => {
                const canDelete =
                  currentUser?.role === "admin" &&
                  u.id !== currentUser.id &&
                  u.role !== "admin";

                return (
                  <tr key={u.id}>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>
                      <span className={`pill ${u.role}`}>
                        {u.role}
                      </span>
                    </td>
                    <td>
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      {canDelete ? (
                        <button
                          className="btn-delete"
                          onClick={() => onDelete(u.id, u.name)}
                        >
                          Delete
                        </button>
                      ) : (
                        <span className="action-disabled">—</span>
                      )}
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
