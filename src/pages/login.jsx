// src/pages/login.jsx
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  async function handleLogin() {
    try {
      const response = await axios.post(
        import.meta.env.VITE_BACKEND_URL + "/api/users/login",
        { email, password }
      );

      toast.success("Login Successful");
      login(response.data.user, response.data.token); // ← saves to context + localStorage

      if (response.data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      toast.error(err.response.data.message);
    }
  }

 /* return (
    <div className="w-full h-screen bg-[url('Login.jpg')] bg-cover bg-center flex flex-row">
      <div className="w-[50%] h-full flex justify-center items-center">
        <div className="w-[400px] h-[500px] backdrop-blur-md rounded-xl shadow shadow-2xl justify-center items-center flex flex-col">
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            type="text"
            placeholder="Email"
            className="w-[300px] h-[45px] bg-[#909fbe] opacity-35 rounded-lg my-[20px] pl-4 outline-none focus:border-blue-500 border"
          />
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            type="password"
            placeholder="Password"
            className="w-[300px] h-[45px] bg-[#909fbe] opacity-35 rounded-lg mb-[20px] pl-4 outline-none focus:border-blue-500 border"
          />
          <button
            onClick={handleLogin}
            className="w-[300px] h-[45px] text-white bg-[#4b66bf] rounded-lg my-[20px] hover:bg-[#3157d4] transition duration-100 cursor-pointer"
          >
            Login
          </button>
        </div>
      </div>
      <div className="w-[50%] h-full"></div>
    </div>
  );*/

return (

        <div className="fixed inset-0 w-screen h-screen bg-[url('/1_login.jpeg')] bg-cover bg-center bg-no-repeat flex items-center overflow-hidden">
            <Toaster position="top-right" />

            {/* LEFT SIDE */}
            <div className="w-1/2 flex justify-center z-10">

                {/* 2ND STYLE CARD */}
                <div className="w-[380px] p-8 flex flex-col items-center rounded-2xl
                bg-white/50 backdrop-blur-lg shadow-2xl">

                    <h2 className="text-4xl font-bold text-[#3498db] mb-10">Login</h2>

                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        /* 2ND STYLE INPUTS: Higher opacity white for better contrast */
                        className="w-full h-[55px] shadow-2xl bg-white/90 rounded-2xl pl-6 mb-2 outline-none text-gray-700 duration-500 shadow-sm focus:ring-2 focus:ring-black-400 shadow-md active:scale-75"
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full h-[55px] bg-white/90 rounded-2xl pl-6 mb-8 outline-none text-gray-700 duration-500 shadow-sm focus:ring-2 focus:ring-black-400 shadow-md active:scale-75"

                    />

                    <button
                        onClick={handleLogin}
                        /* 2ND STYLE BUTTON: Vibrant blue with strong rounded edges */
                        className="w-full h-[45px] bg-[#3498db] text-white text-lg font-bold rounded-2xl hover:bg-[#2980b9] transition-all duration-300 shadow-md active:scale-75"
                    >
                        Login
                    </button>

                    <div className="mt-8 text-[15px] font-medium text-gray-700">
                        Don’t have account?{" "}
                        <span
                            onClick={() => navigate("/signup")}
                            className="text-[#1e6091] font-bold cursor-pointer underline ml-1 "
                        >
                            Sign Up
                        </span>
                    </div>

                </div>

            </div>

            {/* RIGHT SIDE */}
            <div className="w-1/2"></div>
        </div>
    );
}