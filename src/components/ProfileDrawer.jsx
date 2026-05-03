// src/components/ProfileDrawer.jsx
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import mediaUpload from "../../utils/mediaUpload";
import { FaTimes, FaCamera, FaLock, FaUser } from "react-icons/fa";

export default function ProfileDrawer({ open, onClose }) {
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // ── Tab ────────────────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState("profile"); // "profile" | "password"

  // ── Profile state ──────────────────────────────────────────────────────────
  const [loading, setLoading]             = useState(true);
  const [profileData, setProfileData]     = useState(null);
  const [firstName, setFirstName]         = useState("");
  const [lastName, setLastName]           = useState("");
  const [phoneNumber, setPhoneNumber]     = useState("");
  const [studentId, setStudentId]         = useState("");
  const [profileLoading, setProfileLoading] = useState(false);

  // ── Image state ────────────────────────────────────────────────────────────
  const [previewImage, setPreviewImage]     = useState(null);
  const [imageFile, setImageFile]           = useState(null);
  const [imageUploading, setImageUploading] = useState(false);

  // ── Password state ─────────────────────────────────────────────────────────
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword]         = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  // ── Fetch profile when drawer opens ───────────────────────────────────────
  useEffect(() => {
    if (!open) return;
    setActiveTab("profile");
    setLoading(true);
    async function fetchProfile() {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          import.meta.env.VITE_BACKEND_URL + "/api/users/profile",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const u = res.data.user;
        setProfileData(u);
        setFirstName(u.firstName   || "");
        setLastName(u.lastName     || "");
        setPhoneNumber(u.phoneNumber || "");
        setStudentId(u.studentId   || "");
        setPreviewImage(u.image    || null);
      } catch (err) {
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [open]);

  // ── Close on Escape key ────────────────────────────────────────────────────
  useEffect(() => {
    function handleKey(e) { if (e.key === "Escape") onClose(); }
    if (open) document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open]);

  // ── Image handlers ─────────────────────────────────────────────────────────
  function handleImageChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { toast.error("Please select a valid image"); return; }
    if (file.size > 5 * 1024 * 1024) { toast.error("Image must be under 5MB"); return; }
    setImageFile(file);
    setPreviewImage(URL.createObjectURL(file));
  }

  async function handleImageUpload() {
    if (!imageFile) return;
    setImageUploading(true);
    try {
      const imageUrl = await mediaUpload(imageFile);
      const token = localStorage.getItem("token");
      const res = await axios.put(
        import.meta.env.VITE_BACKEND_URL + "/api/users/profile",
        { image: imageUrl },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      login(res.data.user, token);
      setProfileData(res.data.user);
      setPreviewImage(imageUrl);
      setImageFile(null);
      toast.success("Profile picture updated!");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to upload image");
    } finally {
      setImageUploading(false);
    }
  }

  function handleCancelImage() {
    setImageFile(null);
    setPreviewImage(profileData?.image || null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  // ── Save profile ───────────────────────────────────────────────────────────
  async function handleProfileSave() {
    if (!firstName.trim() || !lastName.trim()) { toast.error("Name cannot be empty"); return; }
    if (!phoneNumber.trim()) { toast.error("Phone number cannot be empty"); return; }
    setProfileLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        import.meta.env.VITE_BACKEND_URL + "/api/users/profile",
        { firstName, lastName, phoneNumber, studentId: studentId || null },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      login(res.data.user, token);
      setProfileData(res.data.user);
      toast.success("Profile updated successfully");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update profile");
    } finally {
      setProfileLoading(false);
    }
  }

  // ── Change password ────────────────────────────────────────────────────────
  async function handlePasswordChange() {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all fields"); return;
    }
    if (newPassword.length < 6) { toast.error("New password must be at least 6 characters"); return; }
    if (newPassword !== confirmPassword) { toast.error("Passwords do not match"); return; }
    setPasswordLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        import.meta.env.VITE_BACKEND_URL + "/api/users/change-password",
        { currentPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Password changed. Logging out...");
      setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
      setTimeout(() => { logout(); navigate("/login"); }, 1500);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to change password");
    } finally {
      setPasswordLoading(false);
    }
  }

  // ── Derived ────────────────────────────────────────────────────────────────
  const displayName = `${firstName} ${lastName}`.trim() || "Admin";
  const initials = displayName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed", inset: 0,
          background: "rgba(0,0,0,0.3)",
          backdropFilter: "blur(2px)",
          zIndex: 998,
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          transition: "opacity 0.25s ease",
        }}
      />

      {/* Drawer */}
      <div style={{
        position: "fixed", top: 0, right: 0,
        width: "420px", height: "100vh",
        background: "#fff",
        boxShadow: "-8px 0 40px rgba(0,0,0,0.15)",
        zIndex: 999,
        transform: open ? "translateX(0)" : "translateX(100%)",
        transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        display: "flex", flexDirection: "column",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        overflowY: "auto",
      }}>

        {/* ── Drawer Header ── */}
        <div style={{
          padding: "20px 24px",
          borderBottom: "1px solid #e5f0ff",
          background: "#f0f7ff",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexShrink: 0,
        }}>
          <div>
            <div style={{ fontSize: "16px", fontWeight: "800", color: "#1a3a5c" }}>My Profile</div>
            <div style={{ fontSize: "12px", color: "#7aabcf", marginTop: "2px" }}>Manage your account</div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "#e0efff", border: "none", cursor: "pointer",
              width: "32px", height: "32px", borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#5a8dc0", fontSize: "14px", transition: "background 0.2s",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "#c7dfff"}
            onMouseLeave={e => e.currentTarget.style.background = "#e0efff"}
          >
            <FaTimes />
          </button>
        </div>

        {loading ? (
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "#93bde0", fontSize: "13px" }}>
            Loading profile...
          </div>
        ) : (
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>

            {/* ── Avatar Section ── */}
            <div style={{
              padding: "24px", display: "flex", flexDirection: "column",
              alignItems: "center", gap: "12px",
              borderBottom: "1px solid #eef6ff", background: "#f8fbff",
            }}>
              {/* Avatar */}
              <div style={{ position: "relative" }} className="avatar-wrap">
                {previewImage ? (
                  <img
                    src={previewImage}
                    alt="Profile"
                    style={{
                      width: "80px", height: "80px", borderRadius: "50%",
                      objectFit: "cover", border: "3px solid #bfdbfe", boxShadow: "0 2px 12px rgba(59,130,246,0.2)"
                    }}
                  />
                ) : (
                  <div style={{
                    width: "80px", height: "80px", borderRadius: "50%",
                    background: "linear-gradient(135deg, #3b82f6, #93c5fd)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#fff", fontWeight: "800", fontSize: "24px",
                    border: "3px solid #bfdbfe", boxShadow: "0 2px 12px rgba(59,130,246,0.2)"
                  }}>
                    {initials}
                  </div>
                )}

                {/* Camera overlay */}
                {!imageFile && (
                  <button
                    onClick={() => fileInputRef.current.click()}
                    style={{
                      position: "absolute", inset: 0, borderRadius: "50%",
                      background: "rgba(0,0,0,0.45)", border: "none", cursor: "pointer",
                      display: "flex", flexDirection: "column", alignItems: "center",
                      justifyContent: "center", opacity: 0, transition: "opacity 0.2s",
                      color: "#fff", fontSize: "13px", gap: "3px",
                    }}
                    onMouseEnter={e => e.currentTarget.style.opacity = 1}
                    onMouseLeave={e => e.currentTarget.style.opacity = 0}
                  >
                    <FaCamera style={{ fontSize: "16px" }} />
                    <span style={{ fontSize: "10px", fontWeight: "600" }}>Change</span>
                  </button>
                )}
                <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleImageChange} />
              </div>

              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "15px", fontWeight: "700", color: "#1a3a5c" }}>{displayName}</div>
                <div style={{ fontSize: "11px", color: "#7aabcf", marginTop: "2px" }}>{profileData?.email}</div>
                <span style={{
                  display: "inline-block", marginTop: "6px",
                  fontSize: "10px", fontWeight: "700", letterSpacing: "0.8px",
                  padding: "2px 10px", borderRadius: "20px",
                  background: "#dbeafe", color: "#2563eb",
                }}>
                  ADMINISTRATOR
                </span>
              </div>

              {/* Image action buttons */}
              {imageFile && (
                <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
                  <button
                    onClick={handleCancelImage}
                    disabled={imageUploading}
                    style={{
                      padding: "7px 16px", borderRadius: "8px", fontSize: "12px",
                      fontWeight: "600", border: "1px solid #d1d5db", background: "#fff",
                      color: "#6b7280", cursor: "pointer", fontFamily: "inherit",
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleImageUpload}
                    disabled={imageUploading}
                    style={{
                      padding: "7px 16px", borderRadius: "8px", fontSize: "12px",
                      fontWeight: "600", border: "none", background: "#3b82f6",
                      color: "#fff", cursor: imageUploading ? "not-allowed" : "pointer",
                      opacity: imageUploading ? 0.7 : 1, fontFamily: "inherit",
                      display: "flex", alignItems: "center", gap: "6px",
                    }}
                  >
                    {imageUploading ? "Uploading..." : "Save Photo"}
                  </button>
                </div>
              )}
            </div>

            {/* ── Tabs ── */}
            <div style={{
              display: "flex", borderBottom: "1px solid #e5f0ff",
              padding: "0 24px", background: "#fff", flexShrink: 0,
            }}>
              {[
                { key: "profile",  label: "Profile Info", icon: <FaUser /> },
                { key: "password", label: "Password",     icon: <FaLock /> },
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  style={{
                    display: "flex", alignItems: "center", gap: "6px",
                    padding: "12px 16px", background: "none", border: "none",
                    cursor: "pointer", fontSize: "13px", fontWeight: "600",
                    fontFamily: "inherit",
                    color: activeTab === tab.key ? "#2563eb" : "#94a3b8",
                    borderBottom: activeTab === tab.key ? "2px solid #3b82f6" : "2px solid transparent",
                    marginBottom: "-1px", transition: "all 0.15s",
                  }}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
            </div>

            {/* ── Tab Content ── */}
            <div style={{ padding: "24px", flex: 1, overflowY: "auto" }}>

              {/* Profile Info Tab */}
              {activeTab === "profile" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    {[
                      { label: "First Name", value: firstName, setter: setFirstName, placeholder: "First name" },
                      { label: "Last Name",  value: lastName,  setter: setLastName,  placeholder: "Last name" },
                    ].map(field => (
                      <div key={field.label} style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                        <label style={{ fontSize: "11px", fontWeight: "700", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                          {field.label}
                        </label>
                        <input
                          type="text" value={field.value}
                          onChange={e => field.setter(e.target.value)}
                          placeholder={field.placeholder}
                          style={inputStyle}
                          onFocus={e => e.target.style.borderColor = "#3b82f6"}
                          onBlur={e => e.target.style.borderColor = "#e2e8f0"}
                        />
                      </div>
                    ))}
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                    <label style={labelStyle}>Phone Number</label>
                    <input
                      type="tel" value={phoneNumber}
                      onChange={e => setPhoneNumber(e.target.value)}
                      placeholder="Enter phone number"
                      style={inputStyle}
                      onFocus={e => e.target.style.borderColor = "#3b82f6"}
                      onBlur={e => e.target.style.borderColor = "#e2e8f0"}
                    />
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                    <label style={labelStyle}>
                      Student ID
                      {!profileData?.studentId && (
                        <span style={{ marginLeft: "6px", fontSize: "10px", color: "#3b82f6", fontWeight: "500", textTransform: "none" }}>
                          — not set yet
                        </span>
                      )}
                    </label>
                    <input
                      type="text" value={studentId}
                      onChange={e => setStudentId(e.target.value)}
                      placeholder="Enter student ID (optional)"
                      style={inputStyle}
                      onFocus={e => e.target.style.borderColor = "#3b82f6"}
                      onBlur={e => e.target.style.borderColor = "#e2e8f0"}
                    />
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                    <label style={labelStyle}>Email Address</label>
                    <input
                      type="email" value={profileData?.email || ""} disabled
                      style={{ ...inputStyle, background: "#f8fafc", color: "#94a3b8", cursor: "not-allowed" }}
                    />
                    <span style={{ fontSize: "11px", color: "#94a3b8" }}>Email cannot be changed</span>
                  </div>

                  <button
                    onClick={handleProfileSave}
                    disabled={profileLoading}
                    style={{
                      width: "100%", height: "42px", borderRadius: "10px",
                      background: profileLoading ? "#93c5fd" : "#3b82f6",
                      color: "#fff", border: "none", cursor: profileLoading ? "not-allowed" : "pointer",
                      fontSize: "13px", fontWeight: "700", fontFamily: "inherit",
                      transition: "background 0.2s", marginTop: "4px",
                    }}
                    onMouseEnter={e => { if (!profileLoading) e.currentTarget.style.background = "#2563eb"; }}
                    onMouseLeave={e => { if (!profileLoading) e.currentTarget.style.background = "#3b82f6"; }}
                  >
                    {profileLoading ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              )}

              {/* Password Tab */}
              {activeTab === "password" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <div style={{
                    padding: "12px 14px", borderRadius: "10px",
                    background: "#fef9ec", border: "1px solid #fde68a",
                    fontSize: "12px", color: "#92400e", lineHeight: "1.5",
                  }}>
                    ⚠️ You will be logged out after changing your password.
                  </div>

                  {[
                    { label: "Current Password",  value: currentPassword,  setter: setCurrentPassword,  placeholder: "Enter current password" },
                    { label: "New Password",       value: newPassword,      setter: setNewPassword,      placeholder: "At least 6 characters" },
                    { label: "Confirm Password",   value: confirmPassword,  setter: setConfirmPassword,  placeholder: "Re-enter new password" },
                  ].map(field => (
                    <div key={field.label} style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                      <label style={labelStyle}>{field.label}</label>
                      <input
                        type="password" value={field.value}
                        onChange={e => field.setter(e.target.value)}
                        placeholder={field.placeholder}
                        style={{
                          ...inputStyle,
                          borderColor: field.label === "Confirm Password" && confirmPassword && newPassword !== confirmPassword
                            ? "#f87171" : "#e2e8f0",
                        }}
                        onFocus={e => e.target.style.borderColor = "#3b82f6"}
                        onBlur={e => e.target.style.borderColor =
                          field.label === "Confirm Password" && confirmPassword && newPassword !== confirmPassword
                            ? "#f87171" : "#e2e8f0"
                        }
                      />
                      {field.label === "Confirm Password" && confirmPassword && newPassword !== confirmPassword && (
                        <span style={{ fontSize: "11px", color: "#ef4444" }}>Passwords do not match</span>
                      )}
                    </div>
                  ))}

                  <button
                    onClick={handlePasswordChange}
                    disabled={passwordLoading}
                    style={{
                      width: "100%", height: "42px", borderRadius: "10px",
                      background: passwordLoading ? "#fca5a5" : "#ef4444",
                      color: "#fff", border: "none",
                      cursor: passwordLoading ? "not-allowed" : "pointer",
                      fontSize: "13px", fontWeight: "700", fontFamily: "inherit",
                      transition: "background 0.2s", marginTop: "4px",
                    }}
                    onMouseEnter={e => { if (!passwordLoading) e.currentTarget.style.background = "#dc2626"; }}
                    onMouseLeave={e => { if (!passwordLoading) e.currentTarget.style.background = "#ef4444"; }}
                  >
                    {passwordLoading ? "Changing..." : "Change Password"}
                  </button>
                </div>
              )}

            </div>
          </div>
        )}
      </div>
    </>
  );
}

// ── Shared styles ──────────────────────────────────────────────────────────────
const inputStyle = {
  width: "100%", height: "40px",
  border: "1.5px solid #e2e8f0", borderRadius: "8px",
  padding: "0 12px", fontSize: "13px",
  outline: "none", transition: "border-color 0.15s",
  fontFamily: "'Plus Jakarta Sans', sans-serif",
  background: "#fff", color: "#1e293b", boxSizing: "border-box",
};

const labelStyle = {
  fontSize: "11px", fontWeight: "700",
  color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px",
};