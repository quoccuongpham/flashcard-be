const db = require("../models/index");

const verifyFlashcard = async (req, res, next) => {
    const { collection_id, flashcard_id } = req.body;

    try {
        const flashcard = await db.sequelize.model("Flashcard").findOne({
            where: {
                id: flashcard_id,
            },
        });
        if (flashcard.dataValues.collection_id === collection_id) {
            next();
        } else {
            return res.json({
                success: false,
            });
        }
    } catch (error) {
        if (error) throw error;
    }
};

module.exports = verifyFlashcard;
