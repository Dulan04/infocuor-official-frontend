import { Link, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import AdminAlbumPage from "./admin/adminAlbumPage";
import AddAlbum from "./admin/addAlbum";
import EditAlbumPage from "./admin/editAlbumPage";
import { FaImages, FaCalendarCheck, FaUsers, FaStar, FaSignOutAlt } from "react-icons/fa";
import AdminUserPage from "./admin/adminUserPage";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { to: "/admin/albums",   label: "Albums",   icon: <FaImages /> },
  { to: "/admin/bookings", label: "Bookings", icon: <FaCalendarCheck /> },
  { to: "/admin/users",    label: "Users",    icon: <FaUsers /> },
];

export default function AdminPage() {
  const location = useLocation();
  const currentNav = navItems.find(n => location.pathname.startsWith(n.to));
  const { user, logout } = useAuth();
    const navigate = useNavigate();

  function handleLogout() {
  logout();
  navigate("/login");
}

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

      <div style={{
        display: "flex", height: "100vh",
        background: "#eef6ff", fontFamily: "'Plus Jakarta Sans', sans-serif"
      }}>
        {/* Sidebar */}
        <aside style={{
          width: "230px", minWidth: "230px",
          background: "#f0f7ff",
          borderRight: "1px solid #c3d9f7",
          display: "flex", flexDirection: "column",
        }}>
            
          {/* Logo */}
            <div style={{ padding: "24px 20px 18px", borderBottom: "1px solid #d4e8fc" }}>
            <img
                src="/logo.png"
                alt="Studio Logo"
                style={{
                width: "160px",
                height: "auto",
                objectFit: "contain",
                display: "block",
                }}
            />
            <div style={{
                fontSize: "10px", color: "#93bde0",
                marginTop: "6px", letterSpacing: "1.5px", fontWeight: "600"
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

          {/* User + Logout */}
            <div style={{ padding: "14px 10px", borderTop: "1px solid #d4e8fc" }}>
            <div style={{
                display: "flex", alignItems: "center", gap: "10px",
                padding: "10px 12px", background: "#cee3fe",
                borderRadius: "10px", marginBottom: "8px"
            }}>
                <div style={{
                width: "34px", height: "34px", borderRadius: "50%",
                background: "linear-gradient(135deg, #3b82f6, #93c5fd)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#fff", fontWeight: "800", fontSize: "13px",
                }}>
                {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
                </div>
                <div>
                <div style={{ fontSize: "13px", fontWeight: "700", color: "#1a4f8a" }}>
                    {user?.name || "Admin"}
                </div>
                <div style={{ fontSize: "11px", color: "#5a8dc0" }}>
                    {user?.email || ""}
                </div>
                </div>
            </div>
            <button className="logout-btn" onClick={handleLogout}>
                <FaSignOutAlt /> Logout
            </button>
            </div>
        </aside>

        {/* Main */}
        <main style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
          {/* Top bar */}
          <header style={{
            padding: "18px 30px", borderBottom: "1px solid #c3d9f7",
            background: "#f0f7ff", display: "flex",
            alignItems: "center", justifyContent: "space-between",
          }}>
            <div>
              <div style={{ fontSize: "20px", fontWeight: "800", color: "#1a3a5c" }}>
                {currentNav?.label ?? "Dashboard"}
              </div>
              <div style={{ fontSize: "12px", color: "#7aabcf", marginTop: "2px" }}>
                {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
              </div>
            </div>
          </header>

          {/* Content */}
          <div style={{ flex: 1, overflow: "auto", padding: "28px 30px", background: "#eef6ff" }}>
            <Routes>
              <Route path="/albums"     element={<AdminAlbumPage />} />
              <Route path="/bookings"   element={<PlaceholderPage title="Bookings" />} />
              <Route path="/users"      element={<AdminUserPage/>} />
              <Route path="/add-album"  element={<AddAlbum />} />
              <Route path="/edit-album" element={<EditAlbumPage />} />
            </Routes>
          </div>
        </main>
      </div>
    </>
  );
}

function PlaceholderPage({ title }) {
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", height: "60vh", color: "#93bde0",
      fontSize: "15px", gap: "10px"
    }}>
      <div style={{ fontSize: "40px" }}>🚧</div>
      {title} page coming soon.
    </div>
  );
}