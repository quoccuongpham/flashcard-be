const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");
const db = require("../models/index");

const verifyToken = require("../middleware/verifyToken");
const verifyCollectionParam = require("../middleware/verifyCollectionParam");

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
            if (memo.timeout_interval < current_time) {
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
router.post("/", verifyToken, async (req, res) => {
    const { flashcard_id, value } = req.body;
    const user_id = req.user_id;
    // const result = await db.Memorize.create({
    //     flashcard_id: flashcard_id,
    // });
    // await db.Memorize.update(
    //     { last_evaluate: "good" },
    //     {
    //         where: {
    //             flashcard_id: 3,
    //         },
    //     }
    // );
    // res.json({
    //     success: true,
    // });

    // try {
    //     const sql =
    //         "SELECT * FROM MEMORIZE WHERE USER_ID = ? AND COLLECTION_ID = ? AND FLASHCARD_ID = ?";
    //     const [rows] = await con.execute(sql, [
    //         userID,
    //         collectionID,
    //         flashcardID,
    //     ]);
    //     const { state } = rows[0];
    //     if (state == "L") {
    //         Learing(value, con, rows[0]);
    //     } else {
    //         Graduate(value, con, rows[0]);
    //     }
    //     return res.json({
    //         success: true,
    //         message: "evaluate successfully",
    //     });
    // } catch (error) {
    //     if (error) {
    //         throw error;
    //     }
    //     return res.json({
    //         success: false,
    //         message: "server error",
    //     });
    // }
});

module.exports = router;
