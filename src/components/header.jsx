import { NavLink, useNavigate } from "react-router-dom";

export default function Header() {

    const navigate = useNavigate();

    // Change this to true when user is logged in
    const isLoggedIn = false;
    const user = {
        name: "John Doe",
        profileImage: null, // set profile image URL here or null for initials
    };

    return (
        <header className="w-full h-[96px] bg-white border-b border-gray-200 shadow-sm flex flex-row items-center px-10">

            {/* Left - Logo */}
            <div className="w-[118px] flex items-center">
                <img onClick={() => { navigate("/"); }} src="/logo.png" alt="Logo" className="w-[118px] h-auto object-contain cursor-pointer"/>
            </div>

            {/* Center - Nav Links */}
            <div className="w-[calc(100%-236px)] flex-1 flex justify-center items-center">
                <div className="flex flex-row items-center gap-2">
                    {[
                        { label: "Home",       to: "/"          },
                        { label: "Gallery",    to: "/gallery"   },
                        { label: "Booking",    to: "/booking"   },
                        { label: "About Us",   to: "/about"     },
                        { label: "Contact Us", to: "/contact"   },
                    ].map((item) => (
                        <NavLink
                            key={item.to} to={item.to} end={item.to === "/"} 
                            className={({ isActive }) =>
                                `flex items-center justify-center px-5 py-2 rounded-full text-[15px] font-medium transition-all duration-200 whitespace-nowrap
                                ${isActive
                                    ? "text-blue-600 bg-blue-50 font-semibold"
                                    : "text-gray-600 font-semibold hover:text-blue-600 hover:bg-blue-50"
                                }`
                            }
                            style={{ fontFamily: "'Inter', sans-serif" }}
                        >
                            {item.label}
                        </NavLink>
                    ))}
                </div>
            </div>

            {/* Right - Login or Profile */}
            <div className="w-[118px] h-full flex items-center justify-end">
                {isLoggedIn ? (
                    /* Profile Button */
                    <div
                        onClick={() => navigate("/profile")}
                        className="flex items-center gap-2 cursor-pointer rounded-full px-3 py-1.5 hover:bg-gray-100 transition-all duration-200"
                    >
                        {user.profileImage ? (
                            <img
                                src={user.profileImage}
                                alt="Profile"
                                className="w-[38px] h-[38px] rounded-full object-cover border-2 border-blue-500"
                            />
                        ) : (
                            <div className="w-[38px] h-[38px] rounded-full bg-blue-600 text-white flex items-center justify-center text-[15px] font-bold">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                        )}
                    </div>
                ) : (
                    /* Login Button */
                    <button
                        onClick={() => navigate("/login")}
                        className="flex items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-700 active:scale-95 transition-all duration-200 cursor-pointer"
                        style={{
                            fontFamily: "'Inter', sans-serif",
                            fontWeight: 600,
                            fontSize: "14px",
                            paddingInline: "24px",
                            height: "38px",
                        }}
                    >
                        Login
                    </button>
                )}
            </div>

        </header>
    )
}