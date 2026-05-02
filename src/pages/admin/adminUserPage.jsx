import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { FaSearch, FaBan, FaCheckCircle } from "react-icons/fa";
import toast from "react-hot-toast";

const ROLES  = ["All", "admin", "user"];
const STATUS = ["All", "Active", "Blocked"];

export default function AdminUserPage() {
  const [users, setUsers]               = useState([]);
  const [isLoading, setIsLoading]       = useState(true);
  const [search, setSearch]             = useState("");
  const [roleFilter, setRoleFilter]     = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    const token = localStorage.getItem("token");
    setIsLoading(true);
    axios.get(import.meta.env.VITE_BACKEND_URL + "/api/users", {
      headers: { Authorization: "Bearer " + token },
    }).then((res) => {
      setUsers(res.data);
      setIsLoading(false);
    }).catch(() => setIsLoading(false));
  };

  const handleUpdateUser = async (userId, data) => {
    const token = localStorage.getItem("token");
    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/${userId}`,
        data,
        { headers: { Authorization: "Bearer " + token } }
      );
      toast.success("User updated successfully");
      fetchUsers();
    } catch (e) {
      toast.error(e.response?.data?.message || "Update failed");
    }
  };

  const filtered = useMemo(() => {
    return users.filter((u) => {
      const fullName    = `${u.firstName} ${u.lastName}`.toLowerCase();
      const matchSearch = fullName.includes(search.toLowerCase()) ||
                          u.email.toLowerCase().includes(search.toLowerCase());
      const matchRole   = roleFilter === "All" || u.role === roleFilter;
      const matchStatus = statusFilter === "All" ||
                          (statusFilter === "Blocked" ? u.isBlocked : !u.isBlocked);
      return matchSearch && matchRole && matchStatus;
    });
  }, [users, search, roleFilter, statusFilter]);

  const selectStyle = {
    padding: "9px 14px", borderRadius: "9px",
    border: "1.5px solid #b8d9f8", fontSize: "13px",
    color: "#1a3a5c", background: "#fff", fontWeight: "600",
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    cursor: "pointer", outline: "none",
  };

  const thStyle = {
    padding: "11px 16px", textAlign: "left", fontSize: "11px",
    fontWeight: "700", color: "#4a7aaa", letterSpacing: "1px",
    textTransform: "uppercase", background: "#daeeff",
    borderBottom: "1px solid #b8d9f8",
  };

  const tdStyle = {
    padding: "13px 16px", fontSize: "13.5px", color: "#2c5282",
    borderBottom: "1px solid #dbeeff", verticalAlign: "middle",
  };

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <style>{`
        .action-btn { transition: all 0.18s ease; cursor: pointer; border: none; outline: none; }
        .action-btn:hover { transform: scale(1.05); }
        .search-input:focus { outline: none; box-shadow: 0 0 0 3px #bfdbfe; }
        .filter-select:focus { outline: none; box-shadow: 0 0 0 3px #bfdbfe; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up { animation: fadeUp 0.3s ease both; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "22px" }}>
        <div>
          <div style={{ fontSize: "22px", fontWeight: "800", color: "#1a3a5c" }}>
            User Management
          </div>
          <div style={{ fontSize: "13px", color: "#7aafd4", marginTop: "3px" }}>
            {filtered.length} of {users.length} users shown
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div style={{
        display: "flex", gap: "12px", marginBottom: "20px", flexWrap: "wrap",
        background: "#f0f7ff", padding: "16px 18px",
        borderRadius: "12px", border: "1px solid #c3d9f7",
      }}>
        {/* Search */}
        <div style={{ position: "relative", flex: "1", minWidth: "200px" }}>
          <FaSearch style={{
            position: "absolute", left: "13px", top: "50%",
            transform: "translateY(-50%)", color: "#7aafd4", fontSize: "13px",
          }} />
          <input
            className="search-input"
            type="text"
            placeholder="Search by name or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%", padding: "9px 14px 9px 36px",
              border: "1.5px solid #b8d9f8", borderRadius: "9px",
              fontSize: "13px", color: "#1a3a5c", background: "#fff",
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}
          />
        </div>

        {/* Role Filter */}
        <select
          className="filter-select"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          style={selectStyle}
        >
          {ROLES.map((r) => (
            <option key={r} value={r}>
              {r === "All" ? "All Roles" : r.charAt(0).toUpperCase() + r.slice(1)}
            </option>
          ))}
        </select>

        {/* Status Filter */}
        <select
          className="filter-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={selectStyle}
        >
          {STATUS.map((s) => (
            <option key={s} value={s}>{s === "All" ? "All Status" : s}</option>
          ))}
        </select>

        {/* Clear */}
        {(search || roleFilter !== "All" || statusFilter !== "All") && (
          <button
            onClick={() => { setSearch(""); setRoleFilter("All"); setStatusFilter("All"); }}
            style={{
              padding: "9px 14px", border: "1.5px solid #fca5a5",
              borderRadius: "9px", fontSize: "12px", color: "#dc2626",
              background: "#fff5f5", cursor: "pointer", fontWeight: "700",
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}
          >✕ Clear</button>
        )}
      </div>

      {/* Table */}
      {isLoading ? (
        <div style={{ display: "flex", justifyContent: "center", paddingTop: "80px" }}>
          <div style={{
            width: "44px", height: "44px", borderRadius: "50%",
            border: "3px solid #cee3fe", borderTop: "3px solid #3b82f6",
            animation: "spin 0.8s linear infinite",
          }} />
        </div>
      ) : filtered.length === 0 ? (
        <div style={{
          textAlign: "center", padding: "60px", color: "#7aafd4",
          background: "#f0f7ff", borderRadius: "14px", border: "1px solid #c3d9f7",
        }}>
          <div style={{ fontSize: "36px", marginBottom: "10px" }}>🔍</div>
          No users match your filters.
        </div>
      ) : (
        <div style={{
          background: "#fff", borderRadius: "14px",
          border: "1px solid #c3d9f7",
          boxShadow: "0 2px 16px #3b82f611", overflow: "hidden",
        }} className="fade-up">
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={thStyle}>User</th>
                <th style={thStyle}>Email</th>
                <th style={thStyle}>Phone</th>
                <th style={thStyle}>Role</th>
                <th style={thStyle}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((user) => (
                <tr
                  key={user._id}
                  onMouseEnter={(e) => e.currentTarget.style.background = "#f0f7ff"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "#fff"}
                  style={{ transition: "background 0.15s" }}
                >
                  {/* User */}
                  <td style={tdStyle}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      {user.image ? (
                        <img
                          src={user.image}
                          alt=""
                          style={{
                            width: "38px", height: "38px", borderRadius: "50%",
                            objectFit: "cover", border: "2px solid #cee3fe",
                          }}
                          onError={(e) => {
                            e.target.style.display = "none";
                            e.target.nextSibling.style.display = "flex";
                          }}
                        />
                      ) : null}
                      <div style={{
                        width: "38px", height: "38px", borderRadius: "50%",
                        background: "linear-gradient(135deg, #3b82f6, #93c5fd)",
                        display: user.image ? "none" : "flex",
                        alignItems: "center", justifyContent: "center",
                        color: "#fff", fontWeight: "800", fontSize: "14px",
                        flexShrink: 0,
                      }}>
                        {user.firstName?.charAt(0).toUpperCase()}
                      </div>
                      <span style={{ fontWeight: "700", color: "#1a3a5c" }}>
                        {user.firstName} {user.lastName}
                      </span>
                    </div>
                  </td>

                  {/* Email */}
                  <td style={tdStyle}>{user.email}</td>

                  {/* Phone */}
                  <td style={tdStyle}>
                    {user.phoneNumber || (
                      <span style={{ color: "#b8d9f8", fontSize: "12px" }}>—</span>
                    )}
                  </td>

                  {/* Role Toggle */}
                  <td style={tdStyle}>
                    <button
                      className="action-btn"
                      onClick={() => handleUpdateUser(user._id, {
                        role: user.role === "admin" ? "user" : "admin",
                      })}
                      title={`Click to ${user.role === "admin" ? "demote to User" : "promote to Admin"}`}
                      style={{
                        padding: "5px 12px", borderRadius: "6px",
                        fontSize: "11px", fontWeight: "800",
                        background: user.role === "admin" ? "#fef3c7" : "#e0e7ff",
                        color: user.role === "admin" ? "#92400e" : "#3730a3",
                        border: `1px solid ${user.role === "admin" ? "#fcd34d" : "#c7d2fe"}`,
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                      }}
                    >
                      {user.role.toUpperCase()}
                    </button>
                  </td>

                  {/* Block Toggle */}
                  <td style={tdStyle}>
                    <button
                      className="action-btn"
                      onClick={() => handleUpdateUser(user._id, { isBlocked: !user.isBlocked })}
                      title={`Click to ${user.isBlocked ? "unblock" : "block"} user`}
                      style={{
                        background: user.isBlocked ? "#fff5f5" : "#f0fdf4",
                        border: `1.5px solid ${user.isBlocked ? "#fca5a5" : "#bbf7d0"}`,
                        color: user.isBlocked ? "#ef4444" : "#22c55e",
                        padding: "6px 14px", borderRadius: "8px",
                        fontWeight: "700", fontSize: "13px",
                        display: "inline-flex", alignItems: "center", gap: "6px",
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                      }}
                    >
                      {user.isBlocked ? <FaBan /> : <FaCheckCircle />}
                      {user.isBlocked ? "Blocked" : "Active"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Footer */}
          <div style={{
            padding: "12px 18px", background: "#f0f7ff",
            borderTop: "1px solid #dbeeff", fontSize: "12px",
            color: "#7aafd4", display: "flex", justifyContent: "space-between",
          }}>
            <span>Showing <strong style={{ color: "#1a5fa8" }}>{filtered.length}</strong> users</span>
            <span>Infocuor — Users</span>
          </div>
        </div>
      )}
    </div>
  );
}