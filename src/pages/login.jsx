import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from 'react-hot-toast';

export default function LoginPage(){

    const [email,setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    async function handleLogin(){
        try {
            const response = await axios.post(import.meta.env.VITE_BACKEND_URL + "/api/users/login", {
                email:email,
                password:password
            });

            toast.success("Login Successfull");
            console.log(response.data.token);

            if(response.data.user.role === "admin"){
                navigate("/admin");
            }else{
                navigate("/");
            }

        } catch (err) {
            toast.error(err.response.data.message)
        }
    }

    return(
        <div className="w-full h-screen bg-[url('Login.jpg')] bg-cover bg-center flex flex-row">
            <div className="w-[50%] h-full flex justify-center items-center">
                <div className="w-[400px] h-[500px] backdrop-blur-md rounded-xl shadow shadow-2xl justify-center items-center flex flex-col">
                    <input onChange={
                        (e)=>{
                            setEmail(e.target.value)
                        }
                    } value={email} type="text" placeholder="Email" className="w-[300px] h-[45px] bg-[#909fbe] opacity-35 rounded-lg my-[20px] pl-4 outline-none focus:border-blue-500 border"/>

                    <input onChange={
                        (e)=>{
                            setPassword(e.target.value)
                        }
                    } value={password} type="password" placeholder="Password" className="w-[300px] h-[45px] bg-[#909fbe] opacity-35 rounded-lg mb-[20px] pl-4 outline-none focus:border-blue-500 border"/>
                    <button onClick={handleLogin} className="w-[300px] h-[45px] text-white bg-[#4b66bf] rounded-lg my-[20px] hover:bg-[#3157d4] transition duration-100 cursor-pointer">Login</button>

                </div>
            </div>
            <div className="w-[50%] h-full"></div>
        </div>
    )
}