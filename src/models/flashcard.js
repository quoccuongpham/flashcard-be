"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Flashcard extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Flashcard.belongsTo(models.Collection, {
                foreignKey: "collection_id",
            });
            Flashcard.hasOne(models.Memorize, { foreignKey: "flashcard_id" });
        }
    }
    Flashcard.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            collection_id: DataTypes.INTEGER,
            word: DataTypes.STRING,
            word_type: DataTypes.STRING,
            pronunciation: DataTypes.STRING,
            mean: DataTypes.STRING,
            example: DataTypes.TEXT,
        },
        {
            sequelize,
            modelName: "Flashcard",
            tableName: "Flashcard",
            updatedAt: false,
        }
    );
    return Flashcard;
};
