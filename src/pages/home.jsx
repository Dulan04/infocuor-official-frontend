import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function HomePage(){

    const navigate = useNavigate();

    const images = [
        "bg1.jpg",
        "bg2.jpg",
        "bg3.jpg",
        "bg4.jpg"
    ];

    const [currentImage, setCurrentImage] = useState(0);

    useEffect(()=>{
        const interval = setInterval(()=>{
            setCurrentImage((prev)=> (prev + 1) % images.length);
        },4000);

        return ()=> clearInterval(interval);
    },[]);

    return(
        <div className="w-full h-screen relative overflow-hidden">

            {/* Background */}
            <div 
                className="absolute w-full h-full bg-cover bg-center transition-all duration-1000"
                style={{ backgroundImage: `url(${images[currentImage]})` }}
            ></div>

            {/* Overlay */}
            <div className="absolute w-full h-full bg-gradient-to-r from-[#0b132b]/90 to-[#1c2541]/60"></div>

            {/* Navbar */}
            <div className="absolute top-0 w-full flex justify-between items-center px-[60px] py-[20px] z-10">
                <h1 className="text-white text-2xl font-bold">Infocuor</h1>

                <div className="flex gap-8 text-white items-center">
                    <span className="text-blue-400 border-b-2 border-blue-400 pb-1 cursor-pointer">Home</span>
                    <span className="cursor-pointer">Gallery</span>
                    <span className="cursor-pointer">Booking</span>
                    <span className="cursor-pointer">Contact</span>
                    <span className="cursor-pointer">About</span>

                    <button 
                        onClick={()=> navigate("/login")}
                        className="bg-blue-600 px-5 py-2 rounded-full hover:bg-blue-700 transition"
                    >
                        Login →
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="relative z-10 w-full h-full flex items-center px-[80px]">

                {/* Owl */}
                <div className="w-[40%] flex justify-center">
                    <img 
                        src="Toby.png"
                        className="w-[300px] animate-bounce "
                        style={{ animationDuration: "5s" }}
                    />
                </div>

                {/* Text */}
                <div className="w-[60%] text-white">
                    <h1 className="text-5xl font-semibold mb-4">Welcome to</h1>
                    <h1 className="text-6xl font-bold text-purple-400 mb-6">Infocuor</h1>

                    <p className="text-lg text-gray-300 w-[600px] mb-8">
                        Book the Infocuor Photography Society for university events, ceremonies,
                        workshops, and special occasions with professional-quality coverage
                    </p>

                    <div className="flex gap-5">
                        <button className="border border-white px-6 py-3 rounded-full hover:bg-white hover:text-black transition">
                            Gallery 📷
                        </button>

                        <button className="bg-blue-600 px-6 py-3 rounded-full hover:bg-blue-700 transition">
                            Booking 📅
                        </button>
                    </div>
                </div>

            </div>

        </div>
    )
}