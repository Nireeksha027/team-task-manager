import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";

function CreateProject() {

  const navigate = useNavigate();

  // Get logged user
  const user = JSON.parse(
    localStorage.getItem("user")
  );

  // Admin protection
  if (!user || user.role !== "admin") {

    window.location.href = "/dashboard";
  }

  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");

  const handleProject = async () => {

    // Validation
    if (!projectName || !description) {

      alert("Please fill all fields");

      return;
    }

    try {

      const res = await axios.post(
        "https://team-task-manager-production-019b.up.railway.app/api/projects/create",
        {
          project_name: projectName,
          description,
          created_by: user.id
        }
      );

      alert(res.data);

      navigate("/dashboard");

    } catch (err) {

      console.log(err);

      alert("Project creation failed");
    }
  };

  return (

    <div>

      <Navbar />

      <div className="page-container">

        <div className="form-container">

          <h2>Create Project</h2>

          <input
            type="text"
            placeholder="Enter Project Name"
            value={projectName}
            onChange={(e) =>
              setProjectName(e.target.value)
            }
          />

          <input
            type="text"
            placeholder="Enter Description"
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
          />

          <button onClick={handleProject}>
            Create Project
          </button>

        </div>

      </div>

    </div>
  );
}

export default CreateProject;