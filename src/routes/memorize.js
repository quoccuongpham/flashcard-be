const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");
const db = require("../models/index");

const verifyToken = require("../middleware/verifyToken");
const verifyCollectionParam = require("../middleware/verifyCollectionParam");
const verifyCollection = require("../middleware/verifyCollection");
const Learning = require("../algorithm/Learning");
const Graduate = require("../algorithm/Graduate");

// get memorize for all flashcard of a collection
router.get(
    "/:collection_id",
    verifyToken,
    verifyCollectionParam,
    async (req, res) => {
        const current_time = new Date();
        const collection_id = req.params.collection_id;

        const flashcards = await db.sequelize.model("Flashcard").findAll({
            where: {
                collection_id: collection_id,
            },
        });
        const flashcard_ids = flashcards.map((flashcard) => {
            return flashcard.dataValues.id;
        });

        const memorizes = await db.sequelize.model("Memorize").findAll({
            where: {
                flashcard_id: {
                    [Op.in]: flashcard_ids,
                },
            },
        });

        //? Logic xu ly
        const flashcard_learn = memorizes.map((memo) => {
            const timeout_interval = new Date(memo.dataValues.timeout_interval);
            console.log(`${memo.flashcard_id}: ${timeout_interval}`);
            if (timeout_interval < current_time) {
                console.log("true");
                return memo.dataValues.flashcard_id;
            }
        });

        const flashcard_info = flashcards.filter((fc) => {
            return flashcard_learn.includes(fc.dataValues.id);
        });
        return res.json({
            success: true,
            flashcard_info,
        });
    }
);

// update memorize
router.post("/", verifyToken, verifyCollection, async (req, res) => {
    const { flashcard_id, value } = req.body;
    try {
        const memorize_fc = await db.sequelize.model("Memorize").findOne({
            where: {
                flashcard_id: flashcard_id,
            },
        });
        if (memorize_fc.dataValues.state == "L") {
            Learning(memorize_fc, flashcard_id, value);
        } else {
            Graduate(memorize_fc.dataValues, flashcard_id, value);
        }
        return res.json({
            success: true,
            message: "evaluate successfully",
        });
    } catch (error) {
        if (error) {
            throw error;
        }
        return res.json({
            success: false,
            message: "server error",
        });
    }
});

module.exports = router;
