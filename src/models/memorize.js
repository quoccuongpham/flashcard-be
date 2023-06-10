"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Memorize extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Memorize.belongsTo(models.Flashcard);
        }
    }
    Memorize.init(
        {
            flashcard_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
            },
            ease: DataTypes.FLOAT,
            timeout_interval: DataTypes.DATE,
            state: DataTypes.STRING,
            last_evaluate: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: "Memorize",
            tableName: "Memorize",
            updatedAt: false,
        }
    );
    return Memorize;
};
