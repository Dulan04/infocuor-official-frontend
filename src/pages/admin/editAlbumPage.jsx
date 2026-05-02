import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import mediaUpload from "../../../utils/mediaUpload";
import { FaCloudUploadAlt, FaArrowLeft, FaSave, FaLock } from "react-icons/fa";

const CATEGORIES = [
  "Portrait Sessions",
  "Live Reporting",
  "Event Photography",
  "Digital Marketing",
  "Other",
];

export default function EditAlbumPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const [albumId]                     = useState(location.state.albumId);
  const [albumName, setAlbumName]     = useState(location.state.albumName);
  const [category, setCategory]       = useState(location.state.category);
  const [images, setImages]           = useState([]);
  const [isVisible, setIsVisible]     = useState(location.state.isVisible);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previews, setPreviews]       = useState([]);

  // Show existing images as initial previews
  const existingImages = location.state.images || [];

  function handleImageChange(e) {
    const files = e.target.files;
    setImages(files);
    const urls = Array.from(files).map(f => URL.createObjectURL(f));
    setPreviews(urls);
  }

  async function editAlbum() {
    const token = localStorage.getItem("token");
    if (!token) { toast.error("Please login first"); return; }

    setIsSubmitting(true);
    try {
      let imageUrls = existingImages;

      if (images.length > 0) {
        const promisesArray = Array.from(images).map(img => mediaUpload(img));
        imageUrls = await Promise.all(promisesArray);
      }

      const album = { albumId, albumName, category, images: imageUrls, isVisible };

      await axios.put(
        import.meta.env.VITE_BACKEND_URL + "/api/albums/" + albumId,
        album,
        { headers: { Authorization: "Bearer " + token } }
      );

      toast.success("Album updated successfully");
      setTimeout(() => navigate("/admin/albums"), 1200);

    } catch (e) {
      toast.error(e.response?.data?.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  }

  const inputStyle = {
    width: "100%",
    padding: "11px 14px",
    border: "1.5px solid #b8d9f8",
    borderRadius: "10px",
    fontSize: "13.5px",
    color: "#1a3a5c",
    background: "#fff",
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
  };

  const disabledInputStyle = {
    ...inputStyle,
    background: "#eef6ff",
    color: "#7aafd4",
    cursor: "not-allowed",
    border: "1.5px solid #dbeeff",
  };

  const labelStyle = {
    fontSize: "11.5px",
    fontWeight: "700",
    color: "#4a7aaa",
    letterSpacing: "0.8px",
    textTransform: "uppercase",
    marginBottom: "6px",
    display: "flex",
    alignItems: "center",
    gap: "5px",
  };

  const displayPreviews = previews.length > 0 ? previews : existingImages;
  const isNewUpload = previews.length > 0;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .edit-input:focus { border-color: #3b82f6 !important; box-shadow: 0 0 0 3px #bfdbfe; }
        .edit-input::placeholder { color: #93bde0; }
        .upload-zone:hover { border-color: #3b82f6 !important; background: #eff6ff !important; }
        .cancel-btn:hover { background: #fee2e2 !important; border-color: #fca5a5 !important; color: #dc2626 !important; }
        .submit-btn:hover:not(:disabled) { box-shadow: 0 6px 20px #3b82f655 !important; transform: translateY(-1px); }
        .submit-btn:disabled { opacity: 0.65; cursor: not-allowed; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .img-thumb { transition: transform 0.2s; }
        .img-thumb:hover { transform: scale(1.06); }
      `}</style>

      <div style={{ maxWidth: "620px", margin: "0 auto", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

        {/* Back */}
        <Link to="/admin/albums" style={{
          display: "inline-flex", alignItems: "center", gap: "6px",
          fontSize: "13px", color: "#5a8dc0", textDecoration: "none",
          fontWeight: "600", marginBottom: "20px",
        }}>
          <FaArrowLeft style={{ fontSize: "11px" }} /> Back to Albums
        </Link>

        {/* Card */}
        <div style={{
          background: "#fff", borderRadius: "16px",
          border: "1px solid #c3d9f7",
          boxShadow: "0 4px 20px #3b82f610",
          overflow: "hidden",
        }}>

          {/* Card Header */}
          <div style={{
            padding: "22px 28px",
            background: "linear-gradient(135deg, #cee3fe, #dbeeff)",
            borderBottom: "1px solid #b8d9f8",
            display: "flex", alignItems: "center", gap: "12px",
          }}>
            <div style={{
              width: "40px", height: "40px", borderRadius: "10px",
              background: "linear-gradient(135deg, #3b82f6, #60a5fa)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 4px 12px #3b82f644",
            }}>
              <FaSave style={{ color: "#fff", fontSize: "15px" }} />
            </div>
            <div>
              <div style={{ fontSize: "17px", fontWeight: "800", color: "#1a3a5c" }}>
                Edit Album
              </div>
              <div style={{ fontSize: "12px", color: "#5a8dc0", marginTop: "2px" }}>
                Editing: <strong>{location.state.albumName}</strong>
              </div>
            </div>

            {/* Visible badge top-right */}
            <div style={{ marginLeft: "auto" }}>
              <span style={{
                display: "inline-flex", alignItems: "center", gap: "6px",
                padding: "5px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "700",
                background: isVisible ? "#dcfce7" : "#fee2e2",
                color: isVisible ? "#16a34a" : "#dc2626",
                border: `1px solid ${isVisible ? "#bbf7d0" : "#fca5a5"}`,
              }}>
                <span style={{
                  width: "6px", height: "6px", borderRadius: "50%",
                  background: isVisible ? "#22c55e" : "#ef4444",
                  boxShadow: isVisible ? "0 0 5px #22c55e" : "0 0 5px #ef4444",
                }} />
                {isVisible ? "Visible" : "Hidden"}
              </span>
            </div>
          </div>

          {/* Form Body */}
          <div style={{ padding: "28px", display: "flex", flexDirection: "column", gap: "20px" }}>

            {/* Row: Album ID + Album Name */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div>
                <label style={labelStyle}>
                  <FaLock style={{ fontSize: "10px", color: "#b8d9f8" }} />
                  Album ID
                </label>
                <input
                  style={disabledInputStyle}
                  type="text"
                  value={albumId}
                  disabled
                  title="Album ID cannot be changed"
                />
              </div>
              <div>
                <label style={labelStyle}>Album Name</label>
                <input
                  className="edit-input"
                  style={inputStyle}
                  type="text"
                  placeholder="Album Name"
                  value={albumName}
                  onChange={e => setAlbumName(e.target.value)}
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label style={labelStyle}>Category</label>
              <select
                className="edit-input"
                style={{
                  ...inputStyle, cursor: "pointer", appearance: "none",
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%237aafd4' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat", backgroundPosition: "right 14px center",
                }}
                value={category}
                onChange={e => setCategory(e.target.value)}
              >
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>

            {/* Visibility */}
            <div>
              <label style={labelStyle}>Visibility</label>
              <div style={{ display: "flex", gap: "10px" }}>
                {[true, false].map(val => (
                  <button
                    key={String(val)}
                    onClick={() => setIsVisible(val)}
                    style={{
                      flex: 1, padding: "11px",
                      borderRadius: "10px", cursor: "pointer",
                      fontSize: "13.5px", fontWeight: "700",
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      transition: "all 0.18s ease",
                      border: isVisible === val
                        ? `2px solid ${val ? "#22c55e" : "#ef4444"}`
                        : "2px solid #dbeeff",
                      background: isVisible === val
                        ? (val ? "#dcfce7" : "#fee2e2")
                        : "#f0f7ff",
                      color: isVisible === val
                        ? (val ? "#16a34a" : "#dc2626")
                        : "#7aafd4",
                    }}
                  >
                    <span style={{
                      display: "inline-block", width: "7px", height: "7px",
                      borderRadius: "50%", marginRight: "7px",
                      background: val ? "#22c55e" : "#ef4444",
                      boxShadow: isVisible === val
                        ? (val ? "0 0 6px #22c55e" : "0 0 6px #ef4444")
                        : "none",
                    }} />
                    {val ? "Visible" : "Hidden"}
                  </button>
                ))}
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <label style={labelStyle}>Images</label>

              {/* Existing / New Previews */}
              {displayPreviews.length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "14px" }}>
                  {displayPreviews.map((src, i) => (
                    <div key={i} className="img-thumb" style={{ position: "relative" }}>
                      <img src={src} alt="" style={{
                        width: "72px", height: "72px", objectFit: "cover",
                        borderRadius: "10px",
                        border: isNewUpload ? "2px solid #3b82f6" : "2px solid #cee3fe",
                      }} />
                      {isNewUpload && (
                        <div style={{
                          position: "absolute", top: "-5px", right: "-5px",
                          background: "#3b82f6", color: "#fff",
                          borderRadius: "50%", width: "18px", height: "18px",
                          fontSize: "9px", display: "flex",
                          alignItems: "center", justifyContent: "center",
                          fontWeight: "800",
                        }}>{i + 1}</div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <label className="upload-zone" style={{
                display: "flex", flexDirection: "column", alignItems: "center",
                justifyContent: "center", gap: "8px", padding: "22px 20px",
                border: "2px dashed #b8d9f8", borderRadius: "12px",
                background: "#f0f7ff", cursor: "pointer",
                transition: "all 0.2s ease",
              }}>
                <FaCloudUploadAlt style={{ fontSize: "28px", color: "#7aafd4" }} />
                <div style={{ fontSize: "13px", fontWeight: "700", color: "#3a74b0" }}>
                  {images.length > 0
                    ? `${images.length} new file${images.length > 1 ? "s" : ""} selected — click to change`
                    : "Click to replace images"}
                </div>
                <div style={{ fontSize: "11.5px", color: "#93bde0" }}>
                  Uploading new files will replace all existing images
                </div>
                <input
                  type="file" multiple accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleImageChange}
                />
              </label>
            </div>

            {/* Divider */}
            <div style={{ borderTop: "1px solid #dbeeff" }} />

            {/* Actions */}
            <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
              <Link
                to="/admin/albums"
                className="cancel-btn"
                style={{
                  display: "inline-flex", alignItems: "center", gap: "7px",
                  padding: "11px 22px", borderRadius: "10px",
                  border: "1.5px solid #c3d9f7", background: "#f0f7ff",
                  color: "#5a8dc0", fontSize: "13.5px", fontWeight: "700",
                  textDecoration: "none", transition: "all 0.18s",
                }}
              >
                Cancel
              </Link>

              <button
                className="submit-btn"
                onClick={editAlbum}
                disabled={isSubmitting}
                style={{
                  display: "inline-flex", alignItems: "center", gap: "8px",
                  padding: "11px 26px", borderRadius: "10px",
                  background: "linear-gradient(135deg, #3b82f6, #60a5fa)",
                  color: "#fff", fontSize: "13.5px", fontWeight: "700",
                  border: "none", cursor: "pointer",
                  boxShadow: "0 4px 14px #3b82f644",
                  transition: "all 0.2s ease",
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}
              >
                {isSubmitting ? (
                  <>
                    <div style={{
                      width: "14px", height: "14px", borderRadius: "50%",
                      border: "2px solid #ffffff55", borderTop: "2px solid #fff",
                      animation: "spin 0.7s linear infinite",
                    }} />
                    Saving…
                  </>
                ) : (
                  <><FaSave style={{ fontSize: "12px" }} /> Update Album</>
                )}
              </button>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}