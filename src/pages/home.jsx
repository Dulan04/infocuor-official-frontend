import { Route, Routes } from "react-router-dom";
import Header from "../components/header";

export default function HomePage() {
  return (
    <div className="h-screen w-full flex flex-col items-center">
      <Header/>
      <div className="w-full h-[calc(100vh-80px)] flex flex-col items-center">
        <Routes path="/*">
          <Route path="/" element={<h1>Home Page</h1>}/>
          <Route path="/gallery" element={<h1>Galley</h1>}/>
          <Route path="/booking" element={<h1>Booking</h1>}/>
          <Route path="/about" element={<h1>About Page</h1>}/>
          <Route path="/contact" element={<h1>Contact Page</h1>}/>
          <Route path="/*" element={<h1>404 not found</h1>}/>
        

        </Routes>
      </div>
      
    </div>
  )
}