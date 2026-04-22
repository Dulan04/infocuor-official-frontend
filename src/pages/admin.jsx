import { Link, Route, Routes } from "react-router-dom";
import AdminAlbumPage from "./admin/adminAlbumPage";

export default function AdminPage(){
    return(
        <div className="w-full h-screen bg-red-300 flex flex-row">
            <div className="w-[300px] h-full bg-green-500 flex flex-col">
                <Link to="/admin/albums">Albums</Link>
                <Link to="/admin/bookings">Bookings</Link>
                <Link to="/admin/users">Users</Link>
                <Link to="/admin/reviews">Reviews</Link>

            </div>

            <div className="w-[calc(100%-300px)] h-full bg-blue-200">
                <Routes path="/*">
                    <Route path="/albums" element={<AdminAlbumPage/>}/>
                    <Route path="/bookings" element={<h1>Booking Page</h1>}/>
                    <Route path="/users" element={<h1>Users Page</h1>}/>
                    <Route path="/reviews" element={<h1>Review Page</h1>}/>
                </Routes>

            </div>
            
        </div>
    )
}