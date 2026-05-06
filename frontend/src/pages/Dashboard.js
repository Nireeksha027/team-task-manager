import React, {
  useEffect,
  useState
} from "react";

import axios from "axios";

import Navbar
from "../components/Navbar";

function Dashboard() {

  // Logged User

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  // Protect Dashboard

  if (!user) {

    window.location.href = "/login";
  }

  const [tasks, setTasks] =
    useState([]);

  const [projects, setProjects] =
    useState([]);

  // Search + Filter

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("All");

  // ==========================
  // FETCH DATA
  // ==========================

  useEffect(() => {

    fetchTasks();
    fetchProjects();

  }, []);

  // Fetch Tasks

  const fetchTasks = async () => {

    try {

      const res = await axios.get(
        "http://localhost:5000/api/tasks"
      );

      setTasks(res.data);

    } catch (err) {

      console.log(err);

    }
  };

  // Fetch Projects

  const fetchProjects = async () => {

    try {

      const res = await axios.get(
        "http://localhost:5000/api/projects"
      );

      setProjects(res.data);

    } catch (err) {

      console.log(err);

    }
  };

  // ==========================
  // UPDATE TASK STATUS
  // ==========================

  const updateStatus = async (
    id,
    status
  ) => {

    try {

      await axios.put(
        `http://localhost:5000/api/tasks/update/${id}`,
        {
          status
        }
      );

      fetchTasks();

    } catch (err) {

      console.log(err);

    }
  };

  // ==========================
  // DELETE TASK
  // ==========================

  const deleteTask = async (id) => {

    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this task?"
      );

    if (!confirmDelete) {

      return;
    }

    try {

      await axios.delete(
        `http://localhost:5000/api/tasks/delete/${id}`
      );

      fetchTasks();

    } catch (err) {

      console.log(err);

    }
  };

  // ==========================
  // DELETE PROJECT
  // ==========================

  const deleteProject = async (id) => {

    const confirmDelete =
      window.confirm(
        "Delete this project?"
      );

    if (!confirmDelete) {

      return;
    }

    try {

      await axios.delete(
        `https://team-task-manager-production-019b.up.railway.app/api/projects/delete/${id}`
      );

      fetchProjects();

      fetchTasks();

    } catch (err) {

      console.log(err);

    }
  };

  // ==========================
  // ROLE-BASED FILTER
  // ==========================

  const roleBasedTasks =

    user.role === "admin"

      ? tasks

      : tasks.filter(
          task =>
            task.assigned_to === user.id
        );

  // ==========================
  // SEARCH + FILTER
  // ==========================

  const filteredTasks =

    roleBasedTasks.filter((task) => {

      const matchesSearch =

        task.task_name
          .toLowerCase()
          .includes(
            search.toLowerCase()
          );

      const matchesStatus =

        statusFilter === "All"

        ||

        task.status === statusFilter;

      return (
        matchesSearch &&
        matchesStatus
      );
    });

  // ==========================
  // STATISTICS
  // ==========================

  const completed =
    filteredTasks.filter(
      task =>
        task.status === "Completed"
    ).length;

  const pending =
    filteredTasks.filter(
      task =>
        task.status === "Pending"
    ).length;

  const progress =
    filteredTasks.filter(
      task =>
        task.status === "In Progress"
    ).length;

  return (

    <div>

      <Navbar />

      <div className="dashboard-page">

        <h1>
          Welcome Back,
          {" "}
          {user.name}
          {" "}
          👋
        </h1>

        {/* Statistics */}

        <div className="stats-grid">

          <div className="stats-card">

            <h2>
              {filteredTasks.length}
            </h2>

            <p>Total Tasks</p>

          </div>

          <div className="stats-card">

            <h2>
              {completed}
            </h2>

            <p>Completed</p>

          </div>

          <div className="stats-card">

            <h2>
              {pending}
            </h2>

            <p>Pending</p>

          </div>

          <div className="stats-card">

            <h2>
              {progress}
            </h2>

            <p>In Progress</p>

          </div>

          <div className="stats-card">

            <h2>
              {projects.length}
            </h2>

            <p>Projects</p>

          </div>

        </div>

        {/* Search + Filter */}

        <div className="filter-container">

          <input
            type="text"
            placeholder="Search Task..."
            className="search-input"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

          <select
            className="filter-dropdown"
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
          >

            <option value="All">
              All
            </option>

            <option value="Pending">
              Pending
            </option>

            <option value="In Progress">
              In Progress
            </option>

            <option value="Completed">
              Completed
            </option>

          </select>

        </div>

        {/* Dashboard Grid */}

        <div className="dashboard-grid">

          {/* TASK SECTION */}

          <div>

            <h2>Recent Tasks</h2>

            {
              filteredTasks.length === 0 ? (

                <p>
                  No tasks assigned
                </p>

              ) : (

                filteredTasks.map((task) => {

                  // Overdue Logic

                  const isOverdue =

                    new Date(task.due_date)
                    < new Date()

                    && task.status !== "Completed";

                  return (

                    <div
                      key={task.id}
                      className={
                        isOverdue

                          ? "dashboard-card overdue-card"

                          : "dashboard-card"
                      }
                    >

                      <h3>
                        {task.task_name}
                      </h3>

                      <p>

                        Project:
                        {" "}

                        <strong>
                          {task.project_name}
                        </strong>

                      </p>

                      <p>

                        Assigned To:
                        {" "}

                        <strong>
                          {task.assigned_user}
                        </strong>

                      </p>

                      <p>

                        Status:
                        {" "}

                        <span
                          className={
                            task.status === "Completed"

                              ? "green"

                              : task.status === "Pending"

                              ? "orange"

                              : "blue"
                          }
                        >

                          {task.status}

                        </span>

                      </p>

                      <p>

                        Due:
                        {" "}

                        {
                          new Date(task.due_date)
                          .toLocaleDateString()
                        }

                      </p>

                      {
                        isOverdue && (

                          <p className="overdue">
                            Overdue
                          </p>
                        )
                      }

                      {/* Buttons */}

                      <div className="button-group">

                        {
                          task.status !== "Completed" && (

                            <>

                              <button
                                className="small-btn"
                                onClick={() =>
                                  updateStatus(
                                    task.id,
                                    "In Progress"
                                  )
                                }
                              >
                                Progress
                              </button>

                              <button
                                className="small-btn"
                                onClick={() =>
                                  updateStatus(
                                    task.id,
                                    "Completed"
                                  )
                                }
                              >
                                Complete
                              </button>

                            </>
                          )
                        }

                        {/* Delete only for admin */}

                        {
                          user.role === "admin" && (

                            <button
                              className="small-btn delete-btn"
                              onClick={() =>
                                deleteTask(task.id)
                              }
                            >
                              Delete
                            </button>
                          )
                        }

                      </div>

                    </div>
                  );
                })
              )
            }

          </div>

          {/* PROJECT SECTION */}

          <div>

            <h2>Projects</h2>

            {
              projects.length === 0 ? (

                <p>
                  No projects available
                </p>

              ) : (

                projects.map((project) => (

                  <div
                    key={project.id}
                    className="dashboard-card"
                  >

                    <h3>
                      {project.project_name}
                    </h3>

                    <p>
                      {project.description}
                    </p>

                    {
                      user.role === "admin" && (

                        <button
                          className="small-btn delete-btn"
                          onClick={() =>
                            deleteProject(project.id)
                          }
                        >
                          Delete Project
                        </button>
                      )
                    }

                  </div>
                ))
              )
            }

          </div>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;