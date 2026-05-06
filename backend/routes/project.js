const express = require("express");

const router = express.Router();

const db = require("../db");


// ==========================
// CREATE PROJECT
// ==========================

router.post("/create", (req, res) => {

    const {
        project_name,
        description,
        created_by
    } = req.body;

    // Validation
    if (
        !project_name ||
        !description ||
        !created_by
    ) {

        return res.status(400).json({
            success: false,
            message: "All fields are required"
        });
    }

    const sql = `
        INSERT INTO projects
        (project_name, description, created_by)
        VALUES (?, ?, ?)
    `;

    db.query(
        sql,
        [
            project_name,
            description,
            created_by
        ],
        (err, result) => {

            if (err) {

                console.log(err);

                return res.status(500).json({
                    success: false,
                    message: "Project creation failed"
                });
            }

            res.json({
                success: true,
                message: "Project Created"
            });
        }
    );
});


// ==========================
// GET PROJECTS
// ==========================

router.get("/", (req, res) => {

    const sql = `
        SELECT * FROM projects
        ORDER BY id DESC
    `;

    db.query(sql, (err, result) => {

        if (err) {

            console.log(err);

            return res.status(500).json({
                success: false,
                message: "Failed to fetch projects"
            });
        }

        res.json(result);
    });
});


// ==========================
// DELETE PROJECT
// ==========================

router.delete("/delete/:id", (req, res) => {

    const projectId = req.params.id;

    // Delete tasks first

    const deleteTasks =
        "DELETE FROM tasks WHERE project_id=?";

    db.query(
        deleteTasks,
        [projectId],
        (err, result) => {

            if (err) {

                console.log(err);

                return res.status(500).json({
                    success: false,
                    message: "Failed to delete tasks"
                });
            }

            // Delete project

            const deleteProject =
                "DELETE FROM projects WHERE id=?";

            db.query(
                deleteProject,
                [projectId],
                (err, result) => {

                    if (err) {

                        console.log(err);

                        return res.status(500).json({
                            success: false,
                            message: "Failed to delete project"
                        });
                    }

                    res.json({
                        success: true,
                        message: "Project Deleted"
                    });
                }
            );
        }
    );
});

module.exports = router;