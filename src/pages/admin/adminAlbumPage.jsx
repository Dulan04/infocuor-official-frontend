import { useEffect, useState } from "react"
import { sampleData } from "../../assets/sampleData";
import axios from "axios";
import { Link } from "react-router-dom";

export default function AdminAlbumPage(){
    

    const [albums, setAlbums] = useState(sampleData);

    useEffect(()=>{
        axios.get(import.meta.env.VITE_BACKEND_URL+"/api/albums").then((res)=>{
        console.log(res.data)
        setAlbums(res.data)
    })
    },[])

    return(
        <div className="w-full h-full max-h-full overflow-y-scroll relative">
    <Link to="/admin/add-album" className="bg-green-500 w-[50px] h-[50px] text-center rounded-xl font-bold text-4xl text-white bottom-5 right-4 absolute cursor-pointer">+</Link>
    <table className="w-full text-center">
        <thead>
            <tr>
                <th>Album ID</th>
                <th>Album Name</th>
                <th>Image</th>
                <th>Category</th>
                <th>Visible</th>
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
                            </tr>    
                        )
                    }
                )
            }
        </tbody>
    </table>
</div>
    )
}

