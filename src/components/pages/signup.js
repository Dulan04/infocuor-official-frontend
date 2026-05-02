import "./../styles/auth.css";
import bg from "../images/Img_5.jpg";
import { Link } from "react-router-dom";

function Signup() {
  return (
    <div className="container right" style={{ backgroundImage: `url(${bg})` }}>

      <div className="form-box">
        <h2>Sign Up</h2>

        <input placeholder="First Name" />
        <input placeholder="Last Name" />
        <input placeholder="Email" />
        <input placeholder="Phone Number" />
        <input placeholder="Student ID (Optional)" />
        <input type="password" placeholder="Password" />

        <button>Sign Up</button>

        <p>
          Already have account? <Link to="/">Login</Link>
        </p>
      </div>

    </div>
  );
}

export default Signup;