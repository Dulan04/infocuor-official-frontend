import "./../styles/auth.css";
import bg from "../images/Img_1.jpeg";
import { Link } from "react-router-dom";

function Login() {
  return (
    <div className="container left" style={{ backgroundImage: `url(${bg})` }}>
      
      <div className="form-box">
        <h2>Login</h2>

        <input type="email" placeholder="Email" />
        <input type="password" placeholder="Password" />

        <button>Login</button>

        <p>
          Don't have account? <Link to="/signup">Sign Up</Link>
        </p>
      </div>

    </div>
  );
}

export default Login;