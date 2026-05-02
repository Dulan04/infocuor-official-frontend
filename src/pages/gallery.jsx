import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function GalleryPage() {
  const [albums, setAlbums] = useState([]);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        // Ensure your backend is running on port 3000
        const response = await axios.get('http://localhost:3000/albums');
        
        // Safety: ensure response.data is an array
        const data = Array.isArray(response.data) ? response.data : [];
        setAlbums(data);
      } catch (error) {
        console.error("Backend Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAlbums();
  }, []);

  // Use optional chaining (?.) so it doesn't crash if an album is missing a field
  const categories = ['All', ...new Set(albums.map(album => album?.category).filter(Boolean))];

  const displayAlbums = albums.filter(
    album => filter === 'All' || album?.category === filter
  );

  if (loading) return <div className="p-20 text-center font-bold">Connecting to Archive...</div>;

  return (
    <div className="w-full min-h-screen bg-white font-sans">
      <header className="text-center pt-20 pb-12 px-4">
        <h1 className="text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">The Visual Archive</h1>
        <p className="text-gray-500 max-w-2xl mx-auto text-lg">
          Professional-quality coverage of our university life.
        </p>
      </header>

      <main className="max-w-[1600px] mx-auto px-6 pb-24">
        {/* Filter Bar */}
        <div className="flex justify-center mb-12">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-7 py-2.5 rounded-full border text-sm font-semibold transition-all ${
                  filter === cat ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {displayAlbums.map((album) => (
            <div key={album?._id} className="group bg-white rounded-[1.5rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all flex flex-col">
              <div className="relative h-56 overflow-hidden bg-slate-100">
                <img 
                  src={album?.images?.[0] || "/bg1.jpg"} 
                  alt={album?.albumName} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => { e.target.src = "/bg1.jpg"; }} 
                />
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-slate-800 mb-2">{album?.albumName || "New Album"}</h3>
                <p className="text-gray-500 text-xs mb-6 line-clamp-2">{album?.description}</p>
                <button className="mt-auto w-full bg-[#1d4ed8] text-white py-3 rounded-xl font-bold text-sm">
                  View Album
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}