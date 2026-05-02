import { BrowserRouter, Route, Routes } from "react-router-dom"
import HomePage from "./pages/home"
import LoginPage from "./pages/login"
import SignupPage from "./pages/signup"
import AdminPage from "./pages/admin"
import { Toaster } from "react-hot-toast"

function App() {

  return (
      <BrowserRouter>
        <div className="w-full h-screen">
          <Toaster/>
          <Routes>
            <Route path="/*" element={<HomePage/>} />
            <Route path="/login" element={<LoginPage/>} />
            <Route path="/signup" element={<SignupPage/>} />
            <Route path="/admin/*" element={<AdminPage/>}/>
          </Routes>
        </div>
      </BrowserRouter>
      
  )
}

export default App
