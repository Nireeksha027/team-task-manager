import React from "react";
import { Link } from "react-router-dom";

function Navbar() {

  // Get logged user
  const user = JSON.parse(
    localStorage.getItem("user")
  );

  // Logout
  const logout = () => {

    localStorage.removeItem("user");

    window.location.href = "/login";
  };

  return (

    <div className="navbar">

      <h2>Team Task Manager</h2>

      <div className="nav-links">

        {/* Dashboard */}

        <Link to="/dashboard">
          Dashboard
        </Link>

        {/* Admin Only */}

        {
          user?.role === "admin" && (

            <>

              <Link to="/create-project">
                Create Project
              </Link>

              <Link to="/create-task">
                Create Task
              </Link>

            </>
          )
        }

        {/* Logout */}

        <button
          className="logout-btn"
          onClick={logout}
        >
          Logout
        </button>

      </div>

    </div>
  );
}

export default Navbar;