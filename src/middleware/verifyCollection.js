const db = require("../models/index");

const verifyCollection = async (req, res, next) => {
    const user_id = req.user_id;
    const { collection_id } = req.body;

    const collections = await db.Collection.findAll({
        where: {
            user_id: user_id,
        },
    });
    const check_user_collection = collections.some((collection) => {
        return collection.dataValues.id === collection_id;
    });
    if (check_user_collection) {
        next();
    } else {
        return res.json({
            success: false,
        });
    }
};

module.exports = verifyCollection;
