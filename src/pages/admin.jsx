// src/pages/admin.jsx
import { useState, useRef, useEffect } from "react";
import { Link, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import AdminAlbumPage from "./admin/adminAlbumPage";
import AddAlbum from "./admin/addAlbum";
import EditAlbumPage from "./admin/editAlbumPage";
import { FaImages, FaCalendarCheck, FaUsers, FaSignOutAlt } from "react-icons/fa";
import AdminUserPage from "./admin/adminUserPage";
import { useAuth } from "../context/AuthContext";
import ProfileDrawer from "../components/ProfileDrawer";

const navItems = [
  { to: "/admin/albums",   label: "Albums",   icon: <FaImages /> },
  { to: "/admin/bookings", label: "Bookings", icon: <FaCalendarCheck /> },
  { to: "/admin/users",    label: "Users",    icon: <FaUsers /> },
];

export default function AdminPage() {
  const location     = useLocation();
  const navigate     = useNavigate();
  const { user, logout } = useAuth();

  const [drawerOpen,   setDrawerOpen]   = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const currentNav = navItems.find(n => location.pathname.startsWith(n.to));

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleLogout() {
    logout();
    navigate("/login");
  }

  // Derived display values
  const fullName = user
    ? `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.name || "Admin"
    : "Admin";

  const initials = fullName
    .split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || "A";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Plus Jakarta Sans', sans-serif; }

        .nav-link {
          display: flex; align-items: center; gap: 11px;
          padding: 10px 14px; border-radius: 10px;
          text-decoration: none; font-size: 13.5px;
          font-weight: 500; color: #5a7a9a;
          border-left: 3px solid transparent;
          transition: all 0.18s ease;
        }
        .nav-link:hover { background: #dbeeff; color: #1e6fbf; }
        .nav-link.active {
          background: #cee3fe; color: #1a5fa8;
          font-weight: 700; border-left: 3px solid #3b82f6;
        }
        .nav-link.active .nav-icon { color: #3b82f6; }
        .nav-icon { font-size: 14px; color: #7aafd4; transition: color 0.18s; }

        .profile-btn {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 12px; background: #cee3fe;
          border-radius: 10px; margin-bottom: 8px;
          cursor: pointer; border: none; width: 100%;
          text-align: left; transition: background 0.2s;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .profile-btn:hover { background: #b8d7fd; }

        .logout-btn {
          display: flex; align-items: center; gap: 10px;
          background: none; border: none; cursor: pointer;
          color: #7aafd4; font-size: 13px; padding: 10px 14px;
          width: 100%; border-radius: 8px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          transition: color 0.2s, background 0.2s;
        }
        .logout-btn:hover { color: #ef4444; background: #fee2e2; }
      `}</style>

      {/* Profile Drawer */}
      <ProfileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />

      <div style={{
        display: "flex", height: "100vh",
        background: "#eef6ff", fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}>

        {/* ── Sidebar ── */}
        <aside style={{
          width: "230px", minWidth: "230px",
          background: "#f0f7ff", borderRight: "1px solid #c3d9f7",
          display: "flex", flexDirection: "column",
        }}>

          {/* Logo — click to go home */}
          <div style={{ padding: "24px 20px 18px", borderBottom: "1px solid #d4e8fc" }}>
            <img
              src="/logo.png"
              alt="Studio Logo"
              onClick={() => navigate("/")}
              style={{ width: "160px", height: "auto", objectFit: "contain", display: "block", cursor: "pointer" }}
            />
            <div style={{
              fontSize: "10px", color: "#93bde0",
              marginTop: "6px", letterSpacing: "1.5px", fontWeight: "600",
            }}>
              ADMIN PANEL
            </div>
          </div>

          {/* Nav */}
          <nav style={{ flex: 1, padding: "14px 10px", display: "flex", flexDirection: "column", gap: "3px" }}>
            {navItems.map(({ to, label, icon }) => {
              const active = location.pathname.startsWith(to);
              return (
                <Link key={to} to={to} className={`nav-link${active ? " active" : ""}`}>
                  <span className="nav-icon">{icon}</span>
                  {label}
                </Link>
              );
            })}
          </nav>

        </aside>

        {/* ── Main ── */}
        <main style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>

          {/* ── Top bar ── */}
          <header style={{
            padding: "18px 30px", borderBottom: "1px solid #c3d9f7",
            background: "#f0f7ff", display: "flex",
            alignItems: "center", justifyContent: "space-between",
          }}>
            {/* Page title */}
            <div>
              <div style={{ fontSize: "20px", fontWeight: "800", color: "#1a3a5c" }}>
                {currentNav?.label ?? "Dashboard"}
              </div>
              <div style={{ fontSize: "12px", color: "#7aabcf", marginTop: "2px" }}>
                {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
              </div>
            </div>

            {/* ── Top-right dropdown ── */}
            <div style={{ position: "relative" }} ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(prev => !prev)}
                style={{
                  display: "flex", alignItems: "center", gap: "8px",
                  background: "#fff", border: "1px solid #c3d9f7",
                  borderRadius: "40px", padding: "6px 14px 6px 8px",
                  cursor: "pointer", fontFamily: "inherit",
                  boxShadow: dropdownOpen ? "0 0 0 3px #bfdbfe" : "none",
                  transition: "box-shadow 0.2s",
                }}
              >
                {/* Avatar */}
                {user?.image ? (
                  <img
                    src={user.image}
                    alt="Profile"
                    style={{
                      width: "32px", height: "32px", borderRadius: "50%",
                      objectFit: "cover", border: "2px solid #bfdbfe",
                    }}
                  />
                ) : (
                  <div style={{
                    width: "32px", height: "32px", borderRadius: "50%",
                    background: "linear-gradient(135deg, #3b82f6, #93c5fd)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#fff", fontWeight: "800", fontSize: "12px",
                  }}>
                    {initials}
                  </div>
                )}
                {/* Name */}
                <span style={{
                  fontSize: "13px", fontWeight: "600", color: "#1a3a5c",
                  maxWidth: "100px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                }}>
                  {fullName}
                </span>
                {/* Chevron */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  style={{
                    width: "14px", height: "14px", color: "#94a3b8",
                    transition: "transform 0.2s",
                    transform: dropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
                  }}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown menu */}
              {dropdownOpen && (
                <div style={{
                  position: "absolute", top: "calc(100% + 8px)", right: 0,
                  width: "210px", background: "#fff", borderRadius: "12px",
                  boxShadow: "0 8px 30px rgba(0,0,0,0.12)", border: "1px solid #e5f0ff",
                  overflow: "hidden", zIndex: 100,
                }}>

                  {/* User info */}
                  <div style={{ padding: "12px 14px", borderBottom: "1px solid #e5f0ff", background: "#f8fbff" }}>
                    <div style={{
                      fontSize: "13px", fontWeight: "700", color: "#1a3a5c",
                      overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                    }}>
                      {fullName}
                    </div>
                    <div style={{
                      fontSize: "11px", color: "#7aabcf", marginTop: "2px",
                      overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                    }}>
                      {user?.email}
                    </div>
                  </div>

                  {/* My Profile */}
                  <button
                    onClick={() => { setDrawerOpen(true); setDropdownOpen(false); }}
                    style={dropdownItemStyle}
                    onMouseEnter={e => e.currentTarget.style.background = "#f0f7ff"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" style={{ width: "15px", height: "15px", flexShrink: 0 }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    My Profile
                  </button>

                  {/* Go to Home */}
                  <button
                    onClick={() => { navigate("/"); setDropdownOpen(false); }}
                    style={dropdownItemStyle}
                    onMouseEnter={e => e.currentTarget.style.background = "#f0f7ff"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" style={{ width: "15px", height: "15px", flexShrink: 0 }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    Go to Home
                  </button>

                  {/* Divider */}
                  <div style={{ borderTop: "1px solid #f1f5f9", margin: "4px 0" }} />

                  {/* Logout */}
                  <button
                    onClick={() => { handleLogout(); setDropdownOpen(false); }}
                    style={{ ...dropdownItemStyle, color: "#ef4444" }}
                    onMouseEnter={e => e.currentTarget.style.background = "#fef2f2"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" style={{ width: "15px", height: "15px", flexShrink: 0 }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                  </button>

                </div>
              )}
            </div>
          </header>

          {/* ── Content ── */}
          <div style={{ flex: 1, overflow: "auto", padding: "28px 30px", background: "#eef6ff" }}>
            <Routes>
              <Route path="/albums"     element={<AdminAlbumPage />} />
              <Route path="/bookings"   element={<PlaceholderPage title="Bookings" />} />
              <Route path="/users"      element={<AdminUserPage />} />
              <Route path="/add-album"  element={<AddAlbum />} />
              <Route path="/edit-album" element={<EditAlbumPage />} />
            </Routes>
          </div>
        </main>
      </div>
    </>
  );
}

// ── Shared dropdown item style ─────────────────────────────────────────────────
const dropdownItemStyle = {
  display: "flex", alignItems: "center", gap: "10px",
  width: "100%", padding: "10px 14px",
  background: "transparent", border: "none",
  cursor: "pointer", fontSize: "13px", fontWeight: "500",
  color: "#374151", fontFamily: "'Plus Jakarta Sans', sans-serif",
  textAlign: "left", transition: "background 0.15s",
};

// ── Placeholder ────────────────────────────────────────────────────────────────
function PlaceholderPage({ title }) {
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", height: "60vh", color: "#93bde0",
      fontSize: "15px", gap: "10px",
    }}>
      <div style={{ fontSize: "40px" }}>🚧</div>
      {title} page coming soon.
    </div>
  );
}