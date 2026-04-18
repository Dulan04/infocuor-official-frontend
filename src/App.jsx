import { BrowserRouter, Route, Routes } from "react-router-dom"
import HomePage from "./pages/home"
import LoginPage from "./pages/login"
import SignupPage from "./pages/signup"
import GalleryPage from "./pages/gallery"
import ContactPage from "./pages/contact"
import AboutPage from "./pages/about"
import AdminPage from "./pages/admin"
import { Toaster } from "react-hot-toast"

function App() {

  return (
      <BrowserRouter>
        <div className="w-full h-screen bg-red-500">
          <Toaster/>
          <Routes>
            <Route path="/" element={<HomePage/>} />
            <Route path="/login" element={<LoginPage/>} />
            <Route path="/signup" element={<SignupPage/>} />
            <Route path="/gallery" element={<GalleryPage/>}/>
            <Route path="/contact" element={<ContactPage/>}/>
            <Route path="/about" element={<AboutPage/>}/>
            <Route path="/admin" element={<AdminPage/>}/>
          </Routes>
        </div>
      </BrowserRouter>
      
  )
}

export default App
