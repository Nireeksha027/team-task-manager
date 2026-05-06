import React, {
  useState,
  useEffect
} from "react";

import axios from "axios";

import {
  useNavigate
} from "react-router-dom";

import Navbar
from "../components/Navbar";

function CreateTask() {

  const navigate = useNavigate();

  // Logged User
  const user = JSON.parse(
    localStorage.getItem("user")
  );

  // Admin protection
  if (!user || user.role !== "admin") {

    window.location.href = "/dashboard";
  }

  // States

  const [taskName, setTaskName] =
    useState("");

  const [dueDate, setDueDate] =
    useState("");

  const [users, setUsers] =
    useState([]);

  const [projects, setProjects] =
    useState([]);

  const [assignedTo, setAssignedTo] =
    useState("");

  const [projectId, setProjectId] =
    useState("");

  // ==========================
  // FETCH USERS + PROJECTS
  // ==========================

  useEffect(() => {

    fetchUsers();
    fetchProjects();

  }, []);

  // Fetch users

  const fetchUsers = async () => {

    try {

      const res = await axios.get(
        "https://team-task-manager-production-019b.up.railway.app/api/auth/users"
      );

      setUsers(res.data);

    } catch (err) {

      console.log(err);

    }
  };

  // Fetch projects

  const fetchProjects = async () => {

    try {

      const res = await axios.get(
        "https://team-task-manager-production-019b.up.railway.app/api/projects"
      );

      setProjects(res.data);

    } catch (err) {

      console.log(err);

    }
  };

  // ==========================
  // CREATE TASK
  // ==========================

  const handleTask = async () => {

    // Validation

    if (
      !taskName ||
      !dueDate ||
      !assignedTo ||
      !projectId
    ) {

      alert("Please fill all fields");

      return;
    }

    try {

      const res = await axios.post(
        "https://team-task-manager-production-019b.up.railway.app/api/tasks/create",
        {
          task_name: taskName,
          assigned_to: assignedTo,
          project_id: projectId,
          due_date: dueDate
        }
      );

      alert(res.data);

      navigate("/dashboard");

    } catch (err) {

      console.log(err);

      alert("Task creation failed");
    }
  };

  return (

    <div>

      <Navbar />

      <div className="page-container">

        <div className="form-container">

          <h2>Create Task</h2>

          {/* Task Name */}

          <input
            type="text"
            placeholder="Enter Task Name"
            value={taskName}
            onChange={(e) =>
              setTaskName(e.target.value)
            }
          />

          {/* Due Date */}

          <input
            type="date"
            value={dueDate}
            onChange={(e) =>
              setDueDate(e.target.value)
            }
          />

          {/* Select Member */}

          <select
            className="dropdown"
            value={assignedTo}
            onChange={(e) =>
              setAssignedTo(e.target.value)
            }
          >

            <option value="">
              Select Member
            </option>

            {
              users
                .filter(
                  user =>
                    user.role === "member"
                )
                .map((user) => (

                  <option
                    key={user.id}
                    value={user.id}
                  >
                    {user.name}
                  </option>
                ))
            }

          </select>

          {/* Select Project */}

          <select
            className="dropdown"
            value={projectId}
            onChange={(e) =>
              setProjectId(e.target.value)
            }
          >

            <option value="">
              Select Project
            </option>

            {
              projects.map((project) => (

                <option
                  key={project.id}
                  value={project.id}
                >
                  {project.project_name}
                </option>
              ))
            }

          </select>

          {/* Button */}

          <button onClick={handleTask}>
            Create Task
          </button>

        </div>

      </div>

    </div>
  );
}

export default CreateTask;