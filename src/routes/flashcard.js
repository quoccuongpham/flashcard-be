const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/verifyToken");
const verifyCollection = require("../middleware/verifyCollection");
const verifyCollectionParam = require("../middleware/verifyCollectionParam");
const verifyFlashcard = require("../middleware/verifyFlashcard");
const db = require("../models/index");

//* Get flashcard
router.get(
    "/:collection_id",
    verifyToken,
    verifyCollectionParam,
    async (req, res) => {
        try {
            const collection_id = req.params.collection_id;
            const flashcards = await db.Flashcard.findAll({
                where: {
                    collection_id: collection_id,
                },
            });
            console.log(flashcards);
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
    }
);
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
router.put("/", verifyToken, verifyCollection, async (req, res) => {
    try {
        const {
            fc_id,
            fc_name,
            fc_wordtype,
            fc_pronunciation,
            fc_mean,
            fc_example,
        } = req.body;

        await db.sequelize.model("Flashcard").update(
            {
                word: fc_name,
                word_type: fc_wordtype,
                pronunciation: fc_pronunciation,
                mean: fc_mean,
                example: fc_example,
            },
            {
                where: {
                    id: fc_id,
                },
            }
        );

        return res.json({
            success: true,
            message: "Update flashcard successfully!",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal error!",
        });
    }
});
//* Delete flashcard
router.delete(
    "/",
    verifyToken,
    verifyCollection,
    verifyFlashcard,
    async (req, res) => {
        try {
            const { flashcard_id } = req.body;
            await db.sequelize.model("Memorize").destroy({
                where: {
                    flashcard_id: flashcard_id,
                },
            });
            await db.sequelize.model("Flashcard").destroy({
                where: {
                    id: flashcard_id,
                },
            });
            return res.json({
                success: true,
                message: "Delete flashcard successfully!",
            });
        } catch (error) {
            if (error) throw error;
            return res.status(500).json({
                success: false,
                message: "Internal error!",
            });
        }
    }
);
module.exports = router;
