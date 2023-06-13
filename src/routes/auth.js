const express = require("express");
const router = express.Router();
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const db = require("../models");

const verifyToken = require("../middleware/verifyToken");
// REGISTER
router.post("/register", async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log(username, password);

        //* Simple validation
        if (!username || !password) {
            return res.json({
                success: false,
                message: "Missing username or password!",
            });
        }
        //* Check existing username
        const account = await db.Account.findAll();
        let exist_username = false;
        account.forEach((element) => {
            if (element.dataValues.username === username) {
                exist_username = true;
            }
        });
        if (exist_username) {
            return res.json({
                success: false,
                message: "Username is exsit already!",
            });
        }

        //* All good

        const hashedPassword = await argon2.hash(password);

        const new_account = await db.Account.create({
            username,
            password: hashedPassword,
            role: 1,
        });
        console.log(new_account.id);

        //* Get access token
        const accessToken = jwt.sign(
            {
                user_id: new_account.id,
            },
            process.env.ACCESS_TOKEN_SECRET
        );
        return res.json({
            success: true,
            message: "register account successfully!",
            accessToken,
        });
    } catch (error) {
        return res.json({
            success: false,
            message: "Internal error!",
        });
    }
});

// LOGIN
router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log(username, password);

        //* Simple validation
        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: "Missing username or password!",
            });
        }
        const account = await db.Account.findAll({
            where: {
                username,
            },
        });

        if (account.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Incorect username or password!",
            });
        }
        //* Verify password
        const password_verify = await argon2.verify(
            account[0].dataValues.password,
            password
        );
        if (password_verify) {
            const accessToken = jwt.sign(
                {
                    user_id: account[0].dataValues.id,
                },
                process.env.ACCESS_TOKEN_SECRET
            );

            return res.json({
                success: true,
                message: "login successfully!",
                accessToken,
            });
        } else {
            return res.status(400).json({
                success: false,
                message: "Incorect username or password!",
            });
        }
    } catch (error) {
        return res.json({
            success: false,
            message: "Internal error!",
        });
    }
});

// TEST
router.get("/verify", verifyToken, (req, res) => {
    res.json("success");
});
module.exports = router;
