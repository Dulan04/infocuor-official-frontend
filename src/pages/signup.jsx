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
    )
}