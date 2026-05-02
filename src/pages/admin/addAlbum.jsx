import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom"; // 1. Added useNavigate
import axios from "axios";
import mediaUpload from "../../../utils/mediaUpload";
import { FaCloudUploadAlt, FaArrowLeft, FaPlus } from "react-icons/fa";

const CATEGORIES = [
  "Portrait Sessions",
  "Live Reporting",
  "Event Photography",
  "Digital Marketing",
  "Other",
];

export default function AddAlbum() {
  const navigate = useNavigate(); // 2. Initialize navigate
  const [albumId, setAlbumId]       = useState("");
  const [albumName, setAlbumName]   = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages]         = useState([]);
  const [category, setCategory]     = useState("Other");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previews, setPreviews]     = useState([]);

  function handleImageChange(e) {
    const files = e.target.files;
    setImages(files);
    const urls = Array.from(files).map(f => URL.createObjectURL(f));
    setPreviews(urls);
  }

  async function handleAddAlbum() {
    const token = localStorage.getItem("token");
    if (!token) { toast.error("Please login first"); return; }
    if (images.length <= 0) { toast.error("Please select at least one image"); return; }
    if (!albumId.trim()) { toast.error("Album ID is required"); return; }
    if (!albumName.trim()) { toast.error("Album Name is required"); return; }

    setIsSubmitting(true);
    try {
      const promisesArray = Array.from(images).map(img => mediaUpload(img));
      const imageUrls = await Promise.all(promisesArray);

      const album = { albumId, albumName, description, images: imageUrls, category };

      await axios.post(import.meta.env.VITE_BACKEND_URL + "/api/albums", album, {
        headers: { Authorization: "Bearer " + token },
      });

      toast.success("Album added successfully");
      
      // 3. Navigate to the album list page after a short delay
      setTimeout(() => {
        navigate("/admin/albums");
      }, 1200);

    } catch (e) {
      toast.error(e.response?.data?.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  }

  // ... (rest of your styles and JSX remains exactly the same)
  
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

  const labelStyle = {
    fontSize: "11.5px",
    fontWeight: "700",
    color: "#4a7aaa",
    letterSpacing: "0.8px",
    textTransform: "uppercase",
    marginBottom: "6px",
    display: "block",
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .add-input:focus { border-color: #3b82f6 !important; box-shadow: 0 0 0 3px #bfdbfe; }
        .add-input::placeholder { color: #93bde0; }
        .upload-zone { transition: all 0.2s ease; }
        .upload-zone:hover { border-color: #3b82f6 !important; background: #eff6ff !important; }
        .cancel-btn:hover { background: #fee2e2 !important; border-color: #fca5a5 !important; color: #dc2626 !important; }
        .submit-btn:hover { box-shadow: 0 6px 20px #3b82f655 !important; transform: translateY(-1px); }
        .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none !important; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <div style={{ maxWidth: "620px", margin: "0 auto", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

        <Link to="/admin/albums" style={{
          display: "inline-flex", alignItems: "center", gap: "6px",
          fontSize: "13px", color: "#5a8dc0", textDecoration: "none",
          fontWeight: "600", marginBottom: "20px",
        }}>
          <FaArrowLeft style={{ fontSize: "11px" }} /> Back to Albums
        </Link>

        <div style={{
          background: "#fff",
          borderRadius: "16px",
          border: "1px solid #c3d9f7",
          boxShadow: "0 4px 20px #3b82f610",
          overflow: "hidden",
        }}>

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
              <FaPlus style={{ color: "#fff", fontSize: "15px" }} />
            </div>
            <div>
              <div style={{ fontSize: "17px", fontWeight: "800", color: "#1a3a5c" }}>Add New Album</div>
              <div style={{ fontSize: "12px", color: "#5a8dc0", marginTop: "2px" }}>Fill in the details below to create a new album</div>
            </div>
          </div>

          <div style={{ padding: "28px", display: "flex", flexDirection: "column", gap: "20px" }}>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div>
                <label style={labelStyle}>Album ID</label>
                <input
                  className="add-input"
                  style={inputStyle}
                  type="text"
                  placeholder="e.g. ALB-009"
                  value={albumId}
                  onChange={e => setAlbumId(e.target.value)}
                />
              </div>
              <div>
                <label style={labelStyle}>Album Name</label>
                <input
                  className="add-input"
                  style={inputStyle}
                  type="text"
                  placeholder="e.g. Wedding Shoot"
                  value={albumName}
                  onChange={e => setAlbumName(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label style={labelStyle}>Description</label>
              <textarea
                className="add-input"
                style={{ ...inputStyle, resize: "vertical", minHeight: "90px", lineHeight: "1.6" }}
                placeholder="Write a short description for this album…"
                value={description}
                onChange={e => setDescription(e.target.value)}
              />
            </div>

            <div>
              <label style={labelStyle}>Category</label>
              <select
                className="add-input"
                style={{ ...inputStyle, cursor: "pointer", appearance: "none",
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%237aafd4' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat", backgroundPosition: "right 14px center",
                }}
                value={category}
                onChange={e => setCategory(e.target.value)}
              >
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label style={labelStyle}>Images</label>
              <label className="upload-zone" style={{
                display: "flex", flexDirection: "column", alignItems: "center",
                justifyContent: "center", gap: "8px", padding: "28px 20px",
                border: "2px dashed #b8d9f8", borderRadius: "12px",
                background: "#f0f7ff", cursor: "pointer",
              }}>
                <FaCloudUploadAlt style={{ fontSize: "30px", color: "#7aafd4" }} />
                <div style={{ fontSize: "13.5px", fontWeight: "700", color: "#3a74b0" }}>
                  Click to upload images
                </div>
                <div style={{ fontSize: "12px", color: "#93bde0" }}>
                  PNG, JPG, WEBP — multiple files allowed
                </div>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleImageChange}
                />
              </label>

              {previews.length > 0 && (
                <div style={{
                  display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "14px"
                }}>
                  {previews.map((src, i) => (
                    <div key={i} style={{ position: "relative" }}>
                      <img src={src} alt="" style={{
                        width: "72px", height: "72px", objectFit: "cover",
                        borderRadius: "10px", border: "2px solid #cee3fe",
                      }} />
                      <div style={{
                        position: "absolute", top: "-5px", right: "-5px",
                        background: "#3b82f6", color: "#fff",
                        borderRadius: "50%", width: "18px", height: "18px",
                        fontSize: "9px", display: "flex",
                        alignItems: "center", justifyContent: "center",
                        fontWeight: "800",
                      }}>{i + 1}</div>
                    </div>
                  ))}
                  <div style={{
                    width: "72px", height: "72px", borderRadius: "10px",
                    background: "#eef6ff", border: "2px dashed #b8d9f8",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "11px", color: "#7aafd4", fontWeight: "700", textAlign: "center",
                    lineHeight: "1.3",
                  }}>
                    {previews.length} file{previews.length > 1 ? "s" : ""}
                  </div>
                </div>
              )}
            </div>

            <div style={{ borderTop: "1px solid #dbeeff" }} />

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
                onClick={handleAddAlbum}
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
                    Uploading…
                  </>
                ) : (
                  <><FaPlus style={{ fontSize: "11px" }} /> Add Album</>
                )}
              </button>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}