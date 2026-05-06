const express = require("express");

const router = express.Router();

const db = require("../db");


// ==========================
// CREATE TASK
// ==========================

router.post("/create", (req, res) => {

    const {
        task_name,
        assigned_to,
        project_id,
        due_date
    } = req.body;

    // Validation
    if (
        !task_name ||
        !assigned_to ||
        !project_id ||
        !due_date
    ) {

        return res
            .status(400)
            .json("All fields are required");
    }

    const sql = `
    
    INSERT INTO tasks
    (task_name,status,assigned_to,project_id,due_date)

    VALUES (?,?,?,?,?)
    `;

    db.query(
        sql,
        [
            task_name,
            "Pending",
            assigned_to,
            project_id,
            due_date
        ],
        (err, result) => {

            if (err) {

                return res
                    .status(500)
                    .json(err);
            }

            res.json("Task Created");
        }
    );
});


// ==========================
// GET TASKS
// ==========================

router.get("/", (req, res) => {

    const sql = `
    
    SELECT

      tasks.*,

      users.name AS assigned_user,

      projects.project_name

    FROM tasks

    LEFT JOIN users
    ON tasks.assigned_to = users.id

    LEFT JOIN projects
    ON tasks.project_id = projects.id
    `;

    db.query(sql, (err, result) => {

        if (err) {

            return res
                .status(500)
                .json(err);
        }

        res.json(result);
    });
});


// ==========================
// UPDATE TASK STATUS
// ==========================

router.put("/update/:id", (req, res) => {

    const { status } = req.body;

    const sql =
      "UPDATE tasks SET status=? WHERE id=?";

    db.query(
        sql,
        [
            status,
            req.params.id
        ],
        (err, result) => {

            if (err) {

                return res
                    .status(500)
                    .json(err);
            }

            res.json("Status Updated");
        }
    );
});


// ==========================
// DELETE TASK
// ==========================

router.delete("/delete/:id", (req, res) => {

    const sql =
      "DELETE FROM tasks WHERE id=?";

    db.query(
        sql,
        [req.params.id],
        (err, result) => {

            if (err) {

                return res
                    .status(500)
                    .json(err);
            }

            res.json("Task Deleted");
        }
    );
});


module.exports = router;