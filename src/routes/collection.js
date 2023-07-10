const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");
const db = require("../models/index");
const verifyToken = require("../middleware/verifyToken");

//* Get collections
//?api: /api/collection
router.get("/", verifyToken, async (req, res) => {
    try {
        const user_id = req.user_id;

        let collections = await db.Collection.findAll({
            where: {
                user_id: user_id,
            },
        });
        const count = collections.map(async (collection) => {
            let counted = await db.Flashcard.count({
                where: {
                    collection_id: collection.id,
                },
            });
            return counted;
        });
        const countedCollections = await Promise.all(count);

        for (let x = 0; x < countedCollections.length; x++) {
            collections[x].dataValues.quantity = countedCollections[x];
        }

        res.json({
            success: true,
            message: "Get collection successfully",
            collections,
            countedCollections,
        });
    } catch (error) {
        console.log(error);
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

//* Delete collection
//?api: /api/collection
router.delete("/", verifyToken, async (req, res) => {
    try {
        const user_id = req.user_id;
        const { collection_id } = req.body;
        const flashcards = await db.Flashcard.findAll({
            attributes: ["id"],
            where: {
                collection_id: collection_id,
            },
        });
        const flashcards_rs = flashcards.map(
            (flashcard) => flashcard.dataValues.id
        );

        const test = await db.Flashcard.findAll({
            where: {
                id: {
                    [Op.in]: flashcards_rs,
                },
            },
        });
        console.log(test);
        // delete memorize of collection

        // delete all flashcard of collection

        // const result = await db.Collection.destroy({
        //     where: {
        //         user_id: user_id,
        //         id: collection_id,
        //     },
        // });
        return res.json({
            success: true,
            message: "Create collection successfully",
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal error!",
        });
    }
});

module.exports = router;
