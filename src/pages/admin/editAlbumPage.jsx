import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import mediaUpload from "../../../utils/mediaUpload";

export default function EditAlbumPage(){

    const location = useLocation();
    const [albumId, setAlbumId] = useState(location.state.albumId);
    const [albumName, setAlbumName] = useState(location.state.albumName);
    const [category, setCategory] = useState(location.state.category);
    const [images, setImages] = useState([]);
    const [isVisible, setIsVisible] = useState(location.state.isVisible);

    async function editAlbum(){

        const token = localStorage.getItem("token");
        if(token == null){
            toast.error("Please login first")
            return
        }

        let imageUrls = location.state.images;

        const promisesArray = [];

        for(let i=0; i<images.length; i++){
            promisesArray[i] = mediaUpload(images[i])
        }

        try{

            if(images.length > 0){
                imageUrls = await Promise.all(promisesArray)
            }

            console.log(imageUrls)

            const album = {
                albumId : albumId,
                albumName : albumName,
                category : category,
                images : imageUrls,
                isVisible : isVisible
            }

            axios.put(import.meta.env.VITE_BACKEND_URL + "/api/albums/"+albumId, album, {
                headers : {
                    "Authorization" : "Bearer " + token
                }
            }).then(
                ()=>{
                    toast.success("Album updated successfully")
                }
                    
            ).catch((e)=>{
                    toast.error(e.response.data.message)
                })

        }catch(e){
            console.log(e)
        }

    }

    return(
        <div className="w-full h-full flex flex-col justify-center items-center">
            <input type="text" placeholder="Album ID"
                disabled
                className="input input-bordered w-full max-w-xs"
                value={albumId}
                onChange={(e)=>setAlbumId(e.target.value)} />

            <input type="text" placeholder="Album Name"
                className="input input-bordered w-full max-w-xs"
                value={albumName}
                onChange={(e)=>setAlbumName(e.target.value)} />

            <input type="text" placeholder="Category"
                className="input input-bordered w-full max-w-xs"
                value={category}
                onChange={(e)=>setCategory(e.target.value)} />

            <input type="file" placeholder="Images" multiple
                className="input input-bordered w-full max-w-xs"
                onChange={(e)=>setImages(e.target.files)} />

            <select
                className="input input-bordered w-full max-w-xs"
                value={isVisible}
                onChange={(e)=>setIsVisible(e.target.value === "true")}>
                <option value="true">Visible</option>
                <option value="false">Hidden</option>
            </select>

            <div className="w-full flex justify-center flex-row items-center mt-4">
                <Link to="/admin/albums" className="bg-red-500 text-white font-bold py-2 px-4 rounded mr-4">Cancel</Link>
                <button className="bg-green-500 text-white font-bold py-2 px-4 rounded" onClick={editAlbum}>Update Album</button>
            </div>

        </div>
    )
}