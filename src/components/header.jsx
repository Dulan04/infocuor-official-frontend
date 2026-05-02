// src/components/header.jsx
import { NavLink, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

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
    setDropdownOpen(false);
    navigate("/");
  }

  const initials = user?.firstName
    ? user.firstName.charAt(0).toUpperCase()
    : user?.name?.charAt(0).toUpperCase() || "U";

  return (
    <header className="w-full h-[96px] bg-white border-b border-gray-200 shadow-sm flex flex-row items-center px-10">

      {/* Left — Logo */}
      <div className="w-[118px] flex items-center">
        <img
          onClick={() => navigate("/")}
          src="/logo.png"
          alt="Logo"
          className="w-[118px] h-auto object-contain cursor-pointer"
        />
      </div>

      {/* Center — Nav Links */}
      <div className="flex-1 flex justify-center items-center">
        <div className="flex flex-row items-center gap-2">
          {[
            { label: "Home",       to: "/"        },
            { label: "Gallery",    to: "/gallery"  },
            { label: "Booking",    to: "/booking"  },
            { label: "About Us",   to: "/about"    },
            { label: "Contact Us", to: "/contact"  },
          ].map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `flex items-center justify-center px-5 py-2 rounded-full text-[15px] font-medium transition-all duration-200 whitespace-nowrap
                ${isActive
                  ? "text-blue-600 bg-blue-50 font-semibold"
                  : "text-gray-600 font-semibold hover:text-blue-600 hover:bg-blue-50"
                }`
              }
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      </div>

      {/* Right — Guest: Login + Signup | User: Avatar dropdown */}
      <div className="w-[200px] h-full flex items-center justify-end gap-2">

        {user ? (
          /* ── Logged-in user: avatar + dropdown ── */
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 cursor-pointer rounded-full pl-2 pr-3 py-1.5 hover:bg-gray-100 transition-all duration-200"
            >
              {/* Avatar circle */}
                {user?.image && !user.image.includes("pravatar") ? (
                <img
                    src={user.image}
                    alt="Profile"
                    className="w-[36px] h-[36px] rounded-full object-cover border-2 border-blue-200 shadow-sm"
                />
                ) : (
                <div className="w-[36px] h-[36px] rounded-full bg-gradient-to-br from-blue-500 to-blue-400 text-white flex items-center justify-center text-[15px] font-bold shadow-sm">
                    {initials}
                </div>
                )}
                
              {/* Name */}
              <span className="text-sm font-semibold text-gray-700 max-w-[90px] truncate">
                {user.firstName || user.name?.split(" ")[0] || "Account"}
              </span>
              {/* Chevron */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
                fill="none" viewBox="0 0 24 24" stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown menu */}
            {dropdownOpen && (
              <div className="absolute right-0 top-[calc(100%+8px)] w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 z-50">

                {/* User info at top */}
                <div className="px-4 py-2.5 border-b border-gray-100">
                  <p className="text-sm font-semibold text-gray-800 truncate">
                    {user.firstName && user.lastName
                      ? `${user.firstName} ${user.lastName}`
                      : user.name || "User"}
                  </p>
                  <p className="text-xs text-gray-400 truncate">{user.email}</p>
                </div>

                {/* My Profile */}
                <button
                  onClick={() => { navigate("/profile"); setDropdownOpen(false); }}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition-colors duration-150 cursor-pointer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  My Profile
                </button>

                {/* Admin Panel — only for admins */}
                {user.role === "admin" && (
                  <button
                    onClick={() => { navigate("/admin"); setDropdownOpen(false); }}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition-colors duration-150 cursor-pointer"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    Admin Panel
                  </button>
                )}

                {/* Divider */}
                <div className="border-t border-gray-100 my-1" />

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors duration-150 cursor-pointer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>

              </div>
            )}
          </div>

        ) : (
          /* ── Guest: Login + Sign Up buttons ── */
          <>
            <button
              onClick={() => navigate("/login")}
              className="flex items-center justify-center rounded-full border border-blue-600 text-blue-600 hover:bg-blue-50 active:scale-95 transition-all duration-200 cursor-pointer"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 600,
                fontSize: "14px",
                paddingInline: "20px",
                height: "38px",
              }}
            >
              Login
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="flex items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-700 active:scale-95 transition-all duration-200 cursor-pointer"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 600,
                fontSize: "14px",
                paddingInline: "20px",
                height: "38px",
              }}
            >
              Sign Up
            </button>
          </>
        )}

      </div>
    </header>
  );
}