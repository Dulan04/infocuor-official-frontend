// src/pages/profile.jsx
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import Header from "../components/header";
import mediaUpload from "../../utils/mediaUpload";

export default function ProfilePage() {
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // ── Profile state ──────────────────────────────────────────────────────────
  const [loading, setLoading]             = useState(true);
  const [profileData, setProfileData]     = useState(null);
  const [firstName, setFirstName]         = useState("");
  const [lastName, setLastName]           = useState("");
  const [phoneNumber, setPhoneNumber]     = useState("");
  const [studentId, setStudentId]         = useState("");
  const [profileLoading, setProfileLoading] = useState(false);

  // ── Image state ────────────────────────────────────────────────────────────
  const [previewImage, setPreviewImage]   = useState(null);
  const [imageFile, setImageFile]         = useState(null);
  const [imageUploading, setImageUploading] = useState(false);

  // ── Password state ─────────────────────────────────────────────────────────
  const [currentPassword, setCurrentPassword]   = useState("");
  const [newPassword, setNewPassword]           = useState("");
  const [confirmPassword, setConfirmPassword]   = useState("");
  const [passwordLoading, setPasswordLoading]   = useState(false);

  // ── Redirect guests ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!user) navigate("/login");
  }, [user]);

  // ── Fetch full profile ─────────────────────────────────────────────────────
  useEffect(() => {
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
        if (err?.response?.status === 401) { logout(); navigate("/login"); }
      } finally {
        setLoading(false);
      }
    }
    if (user) fetchProfile();
  }, []);

  // ── Image file selected → show preview ────────────────────────────────────
  function handleImageChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be smaller than 5MB");
      return;
    }
    setImageFile(file);
    setPreviewImage(URL.createObjectURL(file));
  }

  // ── Upload image to Supabase → save URL to backend ────────────────────────
  async function handleImageUpload() {
    if (!imageFile) return;
    setImageUploading(true);
    try {
      // 1. Upload to Supabase, get public URL
      const imageUrl = await mediaUpload(imageFile);

      // 2. Save URL to backend
      const token = localStorage.getItem("token");
      const res = await axios.put(
        import.meta.env.VITE_BACKEND_URL + "/api/users/profile",
        { image: imageUrl },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // 3. Update context + local state
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

  // ── Cancel image selection ─────────────────────────────────────────────────
  function handleCancelImage() {
    setImageFile(null);
    setPreviewImage(profileData?.image || null);
    fileInputRef.current.value = "";
  }

  // ── Save profile info ──────────────────────────────────────────────────────
  async function handleProfileSave() {
    if (!firstName.trim() || !lastName.trim()) {
      toast.error("First name and last name cannot be empty");
      return;
    }
    if (!phoneNumber.trim()) {
      toast.error("Phone number cannot be empty");
      return;
    }
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
      toast.error("Please fill in all password fields");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setPasswordLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        import.meta.env.VITE_BACKEND_URL + "/api/users/change-password",
        { currentPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Password changed. Please login again.");
      setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
      setTimeout(() => { logout(); navigate("/login"); }, 1500);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to change password");
    } finally {
      setPasswordLoading(false);
    }
  }

  // ── Derived ────────────────────────────────────────────────────────────────
  const displayName = `${firstName} ${lastName}`.trim() || "User";
  const initials = displayName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

  if (loading) {
    return (
      <div className="min-h-screen w-full flex flex-col bg-gray-50">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-gray-400 text-sm">Loading profile...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col bg-gray-50">
      <Header />

      <div className="flex-1 flex justify-center items-start py-10 px-4">
        <div className="w-full max-w-2xl flex flex-col gap-6">

          {/* Title */}
          <div>
            <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>
            <p className="text-sm text-gray-500 mt-1">View and manage your account information</p>
          </div>

          {/* ── Profile Picture Card ── */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-base font-semibold text-gray-700 mb-6">Profile Picture</h2>

            <div className="flex flex-col items-center gap-5">

              {/* Avatar */}
              <div className="relative group">
                {previewImage ? (
                  <img
                    src={previewImage}
                    alt="Profile"
                    className="w-28 h-28 rounded-full object-cover border-4 border-blue-100 shadow-md"
                  />
                ) : (
                  <div className="w-28 h-28 rounded-full bg-gradient-to-br from-blue-500 to-blue-300 flex items-center justify-center text-white text-4xl font-bold shadow-md border-4 border-blue-100">
                    {initials}
                  </div>
                )}

                {/* Hover overlay — only when no new file selected yet */}
                {!imageFile && (
                  <button
                    onClick={() => fileInputRef.current.click()}
                    className="absolute inset-0 rounded-full bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-white text-xs mt-1 font-semibold">Change</span>
                  </button>
                )}
              </div>

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />

              {/* If a new image is selected — show action buttons */}
              {imageFile ? (
                <div className="flex flex-col items-center gap-3 w-full">
                  <p className="text-sm text-gray-500">
                    <span className="font-medium text-gray-700">{imageFile.name}</span> selected
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={handleCancelImage}
                      disabled={imageUploading}
                      className="px-5 h-10 rounded-lg border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition cursor-pointer disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleImageUpload}
                      disabled={imageUploading}
                      className="px-5 h-10 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition active:scale-95 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {imageUploading ? (
                        <>
                          <svg className="animate-spin w-4 h-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                          </svg>
                          Uploading...
                        </>
                      ) : "Save Picture"}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-1">
                  <button
                    onClick={() => fileInputRef.current.click()}
                    className="text-sm text-blue-600 hover:text-blue-700 font-semibold cursor-pointer transition"
                  >
                    Click to change photo
                  </button>
                  <p className="text-xs text-gray-400">JPG, PNG or WEBP · Max 5MB</p>
                </div>
              )}
            </div>
          </div>

          {/* ── Profile Info Card ── */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-base font-semibold text-gray-700 mb-6">Profile Information</h2>

            {/* Read-only info row */}
            <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-xl">
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-1">Email</p>
                <p className="text-sm text-gray-700 font-medium">{profileData?.email}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-1">Role</p>
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                  profileData?.role === "admin"
                    ? "bg-blue-100 text-blue-600"
                    : "bg-gray-100 text-gray-500"
                }`}>
                  {profileData?.role === "admin" ? "Administrator" : "Member"}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-600">First Name</label>
                  <input
                    type="text" value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="First name"
                    className="w-full h-11 border border-gray-200 rounded-lg px-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-50 transition"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-600">Last Name</label>
                  <input
                    type="text" value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Last name"
                    className="w-full h-11 border border-gray-200 rounded-lg px-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-50 transition"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-600">Phone Number</label>
                <input
                  type="tel" value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Enter phone number"
                  className="w-full h-11 border border-gray-200 rounded-lg px-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-50 transition"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-600">
                  Student ID
                  {!profileData?.studentId && (
                    <span className="ml-2 text-xs text-blue-500 font-normal">— you can add this now</span>
                  )}
                </label>
                <input
                  type="text" value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  placeholder="Enter student ID (optional)"
                  className="w-full h-11 border border-gray-200 rounded-lg px-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-50 transition"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-600">Email Address</label>
                <input
                  type="email" value={profileData?.email || ""} disabled
                  className="w-full h-11 border border-gray-100 rounded-lg px-4 text-sm bg-gray-50 text-gray-400 cursor-not-allowed"
                />
                <p className="text-xs text-gray-400">Email address cannot be changed</p>
              </div>
            </div>

            <button
              onClick={handleProfileSave} disabled={profileLoading}
              className="mt-6 w-full h-11 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-all duration-200 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              {profileLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>

          {/* ── Change Password Card ── */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-10">
            <h2 className="text-base font-semibold text-gray-700 mb-1">Change Password</h2>
            <p className="text-sm text-gray-400 mb-6">You will be logged out after changing your password</p>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-600">Current Password</label>
                <input
                  type="password" value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="w-full h-11 border border-gray-200 rounded-lg px-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-50 transition"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-600">New Password</label>
                <input
                  type="password" value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full h-11 border border-gray-200 rounded-lg px-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-50 transition"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-600">Confirm New Password</label>
                <input
                  type="password" value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className={`w-full h-11 border rounded-lg px-4 text-sm outline-none focus:ring-2 transition
                    ${confirmPassword && newPassword !== confirmPassword
                      ? "border-red-400 focus:border-red-400 focus:ring-red-50"
                      : "border-gray-200 focus:border-blue-500 focus:ring-blue-50"
                    }`}
                />
                {confirmPassword && newPassword !== confirmPassword && (
                  <p className="text-xs text-red-500 mt-0.5">Passwords do not match</p>
                )}
              </div>
            </div>

            <button
              onClick={handlePasswordChange} disabled={passwordLoading}
              className="mt-6 w-full h-11 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-semibold transition-all duration-200 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              {passwordLoading ? "Changing..." : "Change Password"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}