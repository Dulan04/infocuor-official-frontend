import { useEffect, useState } from "react"
import { sampleData } from "../../assets/sampleData";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";
import toast from "react-hot-toast";

export default function AdminAlbumPage(){

    const [albums, setAlbums] = useState(sampleData);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true)

    useEffect(()=>{
    if(isLoading){
        const token = localStorage.getItem("token");
        axios.get(import.meta.env.VITE_BACKEND_URL+"/api/albums", {
            headers : {
                "Authorization" : "Bearer " + token
            }
        }).then((res)=>{
            console.log(res.data)
            setAlbums(res.data)
            setIsLoading(false)
        })
    }
},[isLoading])

    function deleteAlbum(albumId){
        const token = localStorage.getItem("token");

        if(token == null){
            toast.error("Please Login First")
            return;
        }

        axios.delete(import.meta.env.VITE_BACKEND_URL + "/api/albums/"+albumId, {
            headers : {
                "Authorization" : "Bearer " + token
            }
        }).then(
            ()=>{
                toast.success("Album deleted successfully");
                setIsLoading(true);
            }
        ).catch((e)=>{
            toast.error(e.response.data.message)
        })
    }

    return(
        <div className="w-full h-full max-h-full overflow-y-scroll relative">
            <Link to="/admin/add-album" className="bg-green-500 w-[50px] h-[50px] text-center rounded-xl font-bold text-4xl text-white bottom-5 right-4 absolute cursor-pointer">+</Link>
            {isLoading ?
                <div className="w-full h-full flex justify-center items-center">
                    <div className="w-[70px] h-[70px] border-[5px] border-gray-400 border-t-blue-900 rounded-full animate-spin"></div>
                </div>
                :
                <table className="w-full text-center">
                    <thead>
                        <tr>
                            <th>Album ID</th>
                            <th>Album Name</th>
                            <th>Image</th>
                            <th>Category</th>
                            <th>Visible</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            albums.map(
                                (item,index)=>{
                                    return(
                                        <tr key={index}>
                                            <td>{item.albumId}</td>
                                            <td>{item.albumName}</td>
                                            <td><img src={item.images[0]} className="w-[50px] h-[50px]"/></td>
                                            <td>{item.category}</td>
                                            <td>{item.isVisible ? "Yes" : "No"}</td>
                                            <td>
                                                <div className="flex flex-row justify-center w-full items-center">
                                                    <FaTrash onClick={()=>{
                                                        deleteAlbum(item.albumId)
                                                    }} className="text-[20px] text-red-500 mx-2 cursor-pointer"/>
                                                    <FaEdit onClick={()=>{navigate("/admin/edit-album",{
                                                        state : item
                                                    })}} className="text-[20px] text-blue-500 mx-2 cursor-pointer"/>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                }
                            )
                        }
                    </tbody>
                </table>
            }
        </div>
    )
}