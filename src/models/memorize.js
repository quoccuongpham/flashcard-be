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
            Memorize.belongsTo(models.Flashcard, {
                foreignKey: "flashcard_id",
            });
        }
    }
    Memorize.init(
        {
            flashcard_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
            },
            ease: {
                type: DataTypes.FLOAT,
                defaultValue: 2.5,
            },
            timeout_interval: {
                type: DataTypes.DATE,
            },
            state: {
                type: DataTypes.STRING,
                defaultValue: "L",
            },
            last_evaluate: {
                type: DataTypes.STRING,
                defaultValue: "hard",
            },
        },
        {
            sequelize,
            modelName: "Memorize",
            tableName: "Memorize",
            updatedAt: "timeout_interval",
            createdAt: "timeout_interval",
        }
    );
    return Memorize;
};
