const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/verifyToken");
const verifyCollection = require("../middleware/verifyCollection");
const db = require("../models/index");

//* Get flashcard
router.get("/", verifyToken, verifyCollection, async (req, res) => {
    try {
        const { collection_id } = req.body;
        const flashcards = await db.Flashcard.findAll({
            where: {
                collection_id: collection_id,
            },
        });
        return res.json({
            success: true,
            message: "get flashcard",
            flashcards,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal error",
        });
    }
});
//* Create flashcard
router.post("/", verifyToken, verifyCollection, async (req, res) => {
    try {
        const {
            fc_name,
            fc_wordtype,
            fc_pronunciation,
            fc_mean,
            fc_example,
            collection_id,
        } = req.body;
        const new_flashcard = await db.Flashcard.create({
            collection_id: collection_id,
            word: fc_name,
            word_type: fc_wordtype,
            pronunciation: fc_pronunciation,
            mean: fc_mean,
            example: fc_example,
        });

        // init memorize for flashcard
        await db.Memorize.create({
            flashcard_id: new_flashcard.id,
        });

        return res.json({
            success: true,
            new_flashcard,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal error!",
        });
    }
});
//* Edit flashcard

//* Delete flashcard

module.exports = router;
