const express = require("express");
const router = express.Router();

const db = require("../models/index");
const verifyToken = require("../middleware/verifyToken");

//* Get collections
//?api: /api/collection
router.get("/", verifyToken, async (req, res) => {
    try {
        const user_id = req.user_id;
        const collections = await db.Collection.findAll({
            where: {
                user_id: user_id,
            },
        });
        res.json({
            success: true,
            message: "Get collection successfully",
            collections,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal error",
        });
    }
});

//* Create collection
//?api: /api/collection
router.post("/", verifyToken, async (req, res) => {
    try {
        const { name, des } = req.body;
        const user_id = req.user_id;
        const new_collection = await db.Collection.create({
            user_id,
            name,
            description: des,
        });
        return res.json({
            success: true,
            message: "Create collection successfully",
            collection_id: new_collection,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal error!",
        });
    }
});

module.exports = router;
