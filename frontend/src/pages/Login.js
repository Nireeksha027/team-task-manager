import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function Login() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {

    // Validation
    if (!email || !password) {

      alert("All fields are required");

      return;
    }

    try {

      const res = await axios.post(
        "https://team-task-manager-production-019b.up.railway.app/api/auth/login",
        {
          email,
          password
        }
      );

      alert(res.data.message);

      // Save user in localStorage
      localStorage.setItem(
        "user",
        JSON.stringify(res.data.user)
      );

      // Redirect
      navigate("/dashboard");

    } catch (err) {

      console.log(err);

      alert("Login failed");
    }
  };

  return (

    <div className="page-container">

      <div className="form-container">

        <h2>Login</h2>

        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <button onClick={handleLogin}>
          Login
        </button>

        <div className="link-text">

          Don't have an account?

          <Link to="/signup">
            Signup
          </Link>

        </div>

      </div>

    </div>
  );
}

export default Login;