import { useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import axios from "axios";
import mediaUpload from "../../../utils/mediaUpload";

export default function AddAlbum() {

    const [albumId, setAlbumId] = useState("");
    const [albumName, setAlbumName] = useState("");
    const [description, setDescription] = useState("");
    const [images, setImages] = useState([]);
    const [category, setCategory] = useState("Other");

    async function AddAlbum() {

        const token = localStorage.getItem("token");

        if (token == null) {
            toast.error("Please login first");
            return;
        }

        if (images.length <= 0) {
            toast.error("Please select at least one image");
            return;
        }

        const promisesArray = [];

        for(let i=0; i<images.length; i++){
            promisesArray[i] = mediaUpload(images[i])
        }

        try {

            const imageUrls = await Promise.all(promisesArray);

            const album = {
                albumId,
                albumName,
                description,
                images: imageUrls,
                category
            };

            await axios.post(
                import.meta.env.VITE_BACKEND_URL + "/api/albums",
                album,
                {
                    headers: {
                        Authorization: "Bearer " + token
                    }
                }
            );

            toast.success("Album added successfully");

        } catch (e) {
            console.log(e);
            toast.error(e.response?.data?.message || "Something went wrong");
        }
    }

    return (
        <div className="w-full h-full flex flex-col justify-center items-center gap-2">

            <input
                type="text"
                placeholder="Album ID"
                className="input input-bordered w-full max-w-xs"
                value={albumId}
                onChange={(e) => setAlbumId(e.target.value)}
            />

            <input
                type="text"
                placeholder="Album Name"
                className="input input-bordered w-full max-w-xs"
                value={albumName}
                onChange={(e) => setAlbumName(e.target.value)}
            />

            <input
                type="text"
                placeholder="Description"
                className="input input-bordered w-full max-w-xs"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />

            <input
                type="file"
                multiple
                className="input input-bordered w-full max-w-xs"
                onChange={(e) => setImages(e.target.files)}
            />

            <select
                className="input input-bordered w-full max-w-xs"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
            >
                <option>Portrait Sessions</option>
                <option>Live Reporting</option>
                <option>Event Photography</option>
                <option>Digital Marketing</option>
                <option>Other</option>
            </select>

            <div className="w-full flex justify-center flex-row items-center mt-4">
                <Link to="/admin/albums" className="bg-red-500 text-white font-bold py-2 px-4 rounded mr-4">Cancel</Link>

                <button
                    className="bg-green-500 text-white font-bold py-2 px-4 rounded cursor-pointer"
                    onClick={AddAlbum}
                >
                    Add Album
                </button>
            </div>

        </div>
    );
}