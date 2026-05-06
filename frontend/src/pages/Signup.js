import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function Signup() {

  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async () => {

    try {

      const res = await axios.post(
        "https://team-task-manager-production-019b.up.railway.app/api/auth/signup",
        {
          name,
          email,
          password,
          role: "member"
        }
      );

      alert(res.data);

      navigate("/login");

    } catch (err) {

      console.log(err);

    }
  };

  return (

    <div className="page-container">

      <div className="form-container">

        <h2>Signup</h2>

        <input
          type="text"
          placeholder="Enter Name"
          onChange={(e) =>
            setName(e.target.value)
          }
        />

        <input
          type="email"
          placeholder="Enter Email"
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <input
          type="password"
          placeholder="Enter Password"
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <button onClick={handleSignup}>
          Signup
        </button>

        <div className="link-text">

          Already have account?

          <Link to="/login">
            Login
          </Link>

        </div>

      </div>

    </div>
  );
}

export default Signup;