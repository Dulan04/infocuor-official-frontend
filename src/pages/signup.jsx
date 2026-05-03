import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from 'react-hot-toast';

export default function SignupPage(){

    const [email,setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [studentId, setStudentId] = useState("");

    const navigate = useNavigate();

    async function handleSignup(){
        try {
            const response = await axios.post(import.meta.env.VITE_BACKEND_URL + "/api/users", {
                email:email,
                password:password,
                firstName:firstName,
                lastName:lastName,
                phoneNumber:phoneNumber,
                studentId:studentId
            });

            toast.success("Signup Successfull");
            navigate("/login");
            
        } catch (err) {
            toast.error(err.response.data.message)
        }
    }
/*
    return(
        <div className="w-full h-screen bg-[url('signup.jpg')] bg-cover bg-center flex flex-row">
            
            <div className="w-[50%] h-full"></div>

            <div className="w-[50%] h-full flex justify-center items-center">
                <div className="w-[400px] h-[600px] backdrop-blur-md rounded-xl shadow shadow-2xl justify-center items-center flex flex-col">

                    <input onChange={
                        (e)=>{
                            setFirstName(e.target.value)
                        }
                    } value={firstName} type="text" placeholder="First Name" className="w-[300px] h-[45px] bg-[#909fbe] opacity-35 rounded-lg mt-[20px] pl-4 outline-none focus:border-blue-500 border"/>

                    <input onChange={
                        (e)=>{
                            setLastName(e.target.value)
                        }
                    } value={lastName} type="text" placeholder="Last Name" className="w-[300px] h-[45px] bg-[#909fbe] opacity-35 rounded-lg mt-[20px] pl-4 outline-none focus:border-blue-500 border"/>

                    <input onChange={
                        (e)=>{
                            setEmail(e.target.value)
                        }
                    } value={email} type="text" placeholder="Email" className="w-[300px] h-[45px] bg-[#909fbe] opacity-35 rounded-lg mt-[20px] pl-4 outline-none focus:border-blue-500 border"/>

                    <input onChange={
                        (e)=>{
                            setPhoneNumber(e.target.value)
                        }
                    } value={phoneNumber} type="text" placeholder="Phone Number" className="w-[300px] h-[45px] bg-[#909fbe] opacity-35 rounded-lg mt-[20px] pl-4 outline-none focus:border-blue-500 border"/>

                    <input onChange={
                        (e)=>{
                            setStudentId(e.target.value)
                        }
                    } value={studentId} type="text" placeholder="Student ID (Optional)" className="w-[300px] h-[45px] bg-[#909fbe] opacity-35 rounded-lg mt-[20px] pl-4 outline-none focus:border-blue-500 border"/>

                    <input onChange={
                        (e)=>{
                            setPassword(e.target.value)
                        }
                    } value={password} type="password" placeholder="Password" className="w-[300px] h-[45px] bg-[#909fbe] opacity-35 rounded-lg mt-[20px] pl-4 outline-none focus:border-blue-500 border"/>

                    <button onClick={handleSignup} className="w-[300px] h-[45px] text-white bg-[#4b66bf] rounded-lg my-[20px] hover:bg-[#3157d4] transition duration-100 cursor-pointer">Sign Up</button>

                </div>
            </div>
            
        </div>
    )*/
    return(
        <div className="fixed inset-0 w-screen h-screen bg-[url('/Img_5.jpg')] bg-cover bg-center bg-no-repeat flex items-center overflow-hidden">

            <Toaster />

            {/* LEFT EMPTY */}
            <div className="w-1/2"></div>

            {/* RIGHT CARD */}
            <div className="w-1/2 flex justify-center">

                <div className="w-[380px] p-8 flex flex-col items-center rounded-2xl
                bg-white/50 backdrop-blur-lg shadow-2xl">

                    <h2 className="text-4xl font-bold text-[#3498db] mb-10">Sign Up</h2>
                     <input
                        type="firstName"
                        placeholder="First Name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full h-[55px] bg-white/90 rounded-2xl pl-6 mb-2 outline-none text-gray-700 duration-500 shadow-sm focus:ring-2 focus:ring-black-400 shadow-md active:scale-75"
                    />

                     <input
                        type="lastName"
                        placeholder="Last Name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full h-[55px] bg-white/90 rounded-2xl pl-6 mb-2 outline-none text-gray-700 duration-500 shadow-sm focus:ring-2 focus:ring-black-400 shadow-md active:scale-75"
                    />

                     <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full h-[55px] bg-white/90 rounded-2xl pl-6 mb-2 outline-none text-gray-700 duration-500 shadow-sm focus:ring-2 focus:ring-black-400 shadow-md active:scale-75"
                    />

                     <input
                        type="text"
                        placeholder="Phone Number"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="w-full h-[55px] bg-white/90 rounded-2xl pl-6 mb-2 outline-none text-gray-700 duration-500 shadow-sm focus:ring-2 focus:ring-black-400 shadow-md active:scale-75"
                    />

                     <input
                        type="text"
                        placeholder="Student Id (Optional)"
                        value={studentId}
                        onChange={(e) => setStudentId(e.target.value)}
                        className="w-full h-[55px] bg-white/90 rounded-2xl pl-6 mb-2 outline-none text-gray-700 duration-500 shadow-sm focus:ring-2 focus:ring-black-400 shadow-md active:scale-75"
                    />

                      <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full h-[55px] bg-white/90 rounded-2xl pl-6 mb-8 outline-none text-gray-700 duration-500 shadow-sm focus:ring-2 focus:ring-black-400 shadow-md active:scale-75"
                    />

                    <button
                        onClick={handleSignup}
                        className="w-full h-[45px] bg-[#3498db] text-white text-lg font-bold rounded-2xl hover:bg-[#2980b9] transition-all duration-300 shadow-md active:scale-75"
                    >
                        Sign Up
                    </button>

                    <p className="mt-8 text-[15px] font-medium text-gray-700">
                        Already have account?{" "}
                        <span
                            onClick={()=>navigate("/login")}
                            className="text-[#1e6091] font-bold cursor-pointer underline ml-1 "
                        >
                            Login
                        </span>
                    </p>

                </div>

            </div>
        </div>
    )
}