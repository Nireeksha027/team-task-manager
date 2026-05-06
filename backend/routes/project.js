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
        !description
    ) {

        return res
            .status(400)
            .json("All fields are required");
    }

    const sql = `
    
    INSERT INTO projects
    (project_name,description,created_by)

    VALUES (?,?,?)
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

                return res
                    .status(500)
                    .json(err);
            }

            res.json("Project Created");
        }
    );
});


// ==========================
// GET PROJECTS
// ==========================

router.get("/", (req, res) => {

    const sql =
      "SELECT * FROM projects";

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
// DELETE PROJECT
// ==========================

router.delete("/delete/:id", (req, res) => {

    const projectId = req.params.id;

    // Delete linked tasks first

    const deleteTasks =
      "DELETE FROM tasks WHERE project_id=?";

    db.query(
        deleteTasks,
        [projectId],
        (err, result) => {

            if (err) {

                return res
                    .status(500)
                    .json(err);
            }

            // Then delete project

            const deleteProject =
              "DELETE FROM projects WHERE id=?";

            db.query(
                deleteProject,
                [projectId],
                (err, result) => {

                    if (err) {

                        return res
                            .status(500)
                            .json(err);
                    }

                    res.json(
                      "Project Deleted"
                    );
                }
            );
        }
    );
});


module.exports = router;