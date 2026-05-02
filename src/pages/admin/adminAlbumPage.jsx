import { useEffect, useState, useMemo } from "react";
import { sampleData } from "../../assets/sampleData";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { FaEdit, FaTrash, FaPlus, FaSearch, FaFilter } from "react-icons/fa";
import toast from "react-hot-toast";

const CATEGORIES = ["All", "Event Photography", "Portrait Sessions", "Live Reporting", "Other"];
const VISIBILITY  = ["All", "Visible", "Hidden"];

export default function AdminAlbumPage() {
  const [albums, setAlbums]       = useState(sampleData);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch]       = useState("");
  const [catFilter, setCatFilter] = useState("All");
  const [visFilter, setVisFilter] = useState("All");
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading) return;
    const token = localStorage.getItem("token");
    axios.get(import.meta.env.VITE_BACKEND_URL + "/api/albums", {
      headers: { Authorization: "Bearer " + token },
    }).then(res => {
      setAlbums(res.data);
      setIsLoading(false);
    }).catch(() => setIsLoading(false));
  }, [isLoading]);

  function deleteAlbum(albumId) {
    const token = localStorage.getItem("token");
    if (!token) { toast.error("Please Login First"); return; }
    axios.delete(import.meta.env.VITE_BACKEND_URL + "/api/albums/" + albumId, {
      headers: { Authorization: "Bearer " + token },
    }).then(() => {
      toast.success("Album deleted successfully");
      setIsLoading(true);
    }).catch(e => toast.error(e.response?.data?.message ?? "Error"));
  }

  const filtered = useMemo(() => {
    return albums.filter(a => {
      const matchSearch = a.albumName?.toLowerCase().includes(search.toLowerCase()) ||
                          a.albumId?.toLowerCase().includes(search.toLowerCase());
      const matchCat    = catFilter === "All" || a.category === catFilter;
      const matchVis    = visFilter === "All" ||
                          (visFilter === "Visible" ? a.isVisible : !a.isVisible);
      return matchSearch && matchCat && matchVis;
    });
  }, [albums, search, catFilter, visFilter]);

  const th = {
    padding: "11px 16px", textAlign: "left",
    fontSize: "11px", fontWeight: "700",
    color: "#4a7aaa", letterSpacing: "1px",
    textTransform: "uppercase",
    background: "#daeeff",
    borderBottom: "1px solid #b8d9f8",
  };

  const td = {
    padding: "13px 16px", fontSize: "13.5px",
    color: "#2c5282", borderBottom: "1px solid #dbeeff",
    verticalAlign: "middle",
  };

  return (
    <>
      <style>{`
        .action-btn { transition: all 0.18s ease; }
        .action-btn:hover { transform: scale(1.08); }
        .filter-select:focus { outline: none; }
        .search-input:focus { outline: none; box-shadow: 0 0 0 3px #bfdbfe; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.3s ease both; }
      `}</style>

      {/* Page Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "22px" }}>
        <div>
          <div style={{ fontSize: "22px", fontWeight: "800", color: "#1a3a5c" }}>Album Manager</div>
          <div style={{ fontSize: "13px", color: "#7aafd4", marginTop: "3px" }}>
            {filtered.length} of {albums.length} albums shown
          </div>
        </div>
        <Link to="/admin/add-album" style={{
          display: "flex", alignItems: "center", gap: "8px",
          background: "linear-gradient(135deg, #3b82f6, #60a5fa)",
          color: "#fff", padding: "11px 20px", borderRadius: "10px",
          textDecoration: "none", fontSize: "13px", fontWeight: "700",
          boxShadow: "0 4px 14px #3b82f644", transition: "box-shadow 0.2s",
        }}>
          <FaPlus style={{ fontSize: "11px" }} /> Add Album
        </Link>
      </div>

      {/* Search + Filters Bar */}
      <div style={{
        display: "flex", gap: "12px", marginBottom: "20px",
        flexWrap: "wrap", alignItems: "center",
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
            placeholder="Search by name or ID…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: "100%", padding: "9px 14px 9px 36px",
              border: "1.5px solid #b8d9f8", borderRadius: "9px",
              fontSize: "13px", color: "#1a3a5c",
              background: "#fff", transition: "box-shadow 0.2s",
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}
          />
        </div>

        {/* Category Filter */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <FaFilter style={{ color: "#7aafd4", fontSize: "12px" }} />
          <select
            className="filter-select"
            value={catFilter}
            onChange={e => setCatFilter(e.target.value)}
            style={{
              padding: "9px 14px", border: "1.5px solid #b8d9f8",
              borderRadius: "9px", fontSize: "13px", color: "#1a3a5c",
              background: "#fff", cursor: "pointer",
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: "600",
            }}
          >
            {CATEGORIES.map(c => <option key={c} value={c}>{c === "All" ? "All Categories" : c}</option>)}
          </select>
        </div>

        {/* Visibility Filter */}
        <select
          className="filter-select"
          value={visFilter}
          onChange={e => setVisFilter(e.target.value)}
          style={{
            padding: "9px 14px", border: "1.5px solid #b8d9f8",
            borderRadius: "9px", fontSize: "13px", color: "#1a3a5c",
            background: "#fff", cursor: "pointer",
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontWeight: "600",
          }}
        >
          {VISIBILITY.map(v => <option key={v} value={v}>{v === "All" ? "All Visibility" : v}</option>)}
        </select>

        {/* Clear button */}
        {(search || catFilter !== "All" || visFilter !== "All") && (
          <button
            onClick={() => { setSearch(""); setCatFilter("All"); setVisFilter("All"); }}
            style={{
              padding: "9px 14px", border: "1.5px solid #fca5a5",
              borderRadius: "9px", fontSize: "12px", color: "#dc2626",
              background: "#fff5f5", cursor: "pointer", fontWeight: "700",
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}
          >
            ✕ Clear
          </button>
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
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      ) : filtered.length === 0 ? (
        <div style={{
          textAlign: "center", padding: "60px", color: "#7aafd4",
          background: "#f0f7ff", borderRadius: "14px", border: "1px solid #c3d9f7",
        }}>
          <div style={{ fontSize: "36px", marginBottom: "10px" }}>🔍</div>
          No albums match your filters.
        </div>
      ) : (
        <div style={{
          background: "#fff", borderRadius: "14px",
          border: "1px solid #c3d9f7",
          boxShadow: "0 2px 16px #3b82f611",
          overflow: "hidden",
        }} className="fade-up">
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={th}>Album ID</th>
                <th style={th}>Album Name</th>
                <th style={th}>Image</th>
                <th style={th}>Category</th>
                <th style={th}>Visible</th>
                <th style={{ ...th, textAlign: "center" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item, index) => (
                <tr
                  key={index}
                  style={{ transition: "background 0.15s" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#f0f7ff"}
                  onMouseLeave={e => e.currentTarget.style.background = "#fff"}
                >
                  <td style={td}>
                    <span style={{
                      background: "#cee3fe", color: "#1a5fa8",
                      padding: "3px 9px", borderRadius: "6px",
                      fontSize: "11.5px", fontWeight: "700",
                      letterSpacing: "0.4px",
                    }}>{item.albumId}</span>
                  </td>
                  <td style={{ ...td, fontWeight: "600", color: "#1a3a5c" }}>{item.albumName}</td>
                  <td style={td}>
                    <img
                      src={item.images?.[0]}
                      alt=""
                      style={{
                        width: "46px", height: "46px", objectFit: "cover",
                        borderRadius: "9px", border: "2px solid #dbeeff",
                        background: "#eef6ff",
                      }}
                    />
                  </td>
                  <td style={td}>
                    <span style={{
                      background: "#eef6ff", color: "#3a74b0",
                      padding: "4px 11px", borderRadius: "20px",
                      fontSize: "12px", fontWeight: "600",
                      border: "1px solid #c3d9f7",
                    }}>{item.category}</span>
                  </td>
                  <td style={td}>
                    <span style={{
                      display: "inline-flex", alignItems: "center", gap: "6px",
                      fontSize: "12.5px", fontWeight: "700",
                      color: item.isVisible ? "#16a34a" : "#dc2626",
                    }}>
                      <span style={{
                        width: "7px", height: "7px", borderRadius: "50%",
                        background: item.isVisible ? "#22c55e" : "#ef4444",
                        boxShadow: item.isVisible ? "0 0 6px #22c55e88" : "0 0 6px #ef444488",
                        display: "inline-block",
                      }} />
                      {item.isVisible ? "Visible" : "Hidden"}
                    </span>
                  </td>
                  <td style={{ ...td, textAlign: "center" }}>
                    <div style={{ display: "flex", justifyContent: "center", gap: "8px" }}>
                      <button
                        className="action-btn"
                        onClick={() => deleteAlbum(item.albumId)}
                        title="Delete"
                        style={{
                          background: "#fff5f5", border: "1.5px solid #fca5a5",
                          color: "#ef4444", padding: "8px 11px",
                          borderRadius: "8px", cursor: "pointer", fontSize: "13px",
                        }}
                      ><FaTrash /></button>
                      <button
                        className="action-btn"
                        onClick={() => navigate("/admin/edit-album", { state: item })}
                        title="Edit"
                        style={{
                          background: "#eff6ff", border: "1.5px solid #bfdbfe",
                          color: "#3b82f6", padding: "8px 11px",
                          borderRadius: "8px", cursor: "pointer", fontSize: "13px",
                        }}
                      ><FaEdit /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Table Footer */}
          <div style={{
            padding: "12px 18px", background: "#f0f7ff",
            borderTop: "1px solid #dbeeff", fontSize: "12px",
            color: "#7aafd4", display: "flex", justifyContent: "space-between",
          }}>
            <span>Showing <strong style={{ color: "#1a5fa8" }}>{filtered.length}</strong> results</span>
            <span>Infocuor - Albums</span>
          </div>
        </div>
      )}
    </>
  );
}