const express = require("express");
const router = express.Router();

const db = require("../db");

const bcrypt = require("bcryptjs");


// ==========================
// SIGNUP
// ==========================

router.post("/signup", async (req, res) => {

    const {
        name,
        email,
        password,
        role
    } = req.body;

    // Validation
    if (!name || !email || !password) {

        return res
            .status(400)
            .json("All fields are required");
    }

    try {

        // Encrypt password
        const hashedPassword =
            await bcrypt.hash(password, 10);

        const sql =
            "INSERT INTO users (name,email,password,role) VALUES (?,?,?,?)";

        db.query(
            sql,
            [
                name,
                email,
                hashedPassword,
                role
            ],
            (err, result) => {

                if (err) {

                    return res
                        .status(500)
                        .json(err);
                }

                res.json("User Registered");
            }
        );

    } catch (err) {

        console.log(err);
    }
});


// ==========================
// LOGIN
// ==========================

router.post("/login", (req, res) => {

    const {
        email,
        password
    } = req.body;

    // Validation
    if (!email || !password) {

        return res
            .status(400)
            .json("All fields are required");
    }

    const sql =
        "SELECT * FROM users WHERE email=?";

    db.query(sql, [email], async (err, result) => {

        if (err) {

            return res
                .status(500)
                .json(err);
        }

        // User not found
        if (result.length === 0) {

            return res.json("User not found");
        }

        const user = result[0];

        // Compare password
        const validPassword =
            await bcrypt.compare(
                password,
                user.password
            );

        if (!validPassword) {

            return res.json("Invalid password");
        }

        // Success
        res.json({

            message: "Login successful",

            user: {

                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    });
});


// ==========================
// GET USERS
// ==========================

router.get("/users", (req, res) => {

    const sql =
      "SELECT id,name,email,role FROM users";

    db.query(sql, (err, result) => {

        if (err) {

            return res
                .status(500)
                .json(err);
        }

        res.json(result);
    });
});


module.exports = router;