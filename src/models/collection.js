"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class Collection extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Collection.belongsTo(models.Account);
            Collection.hasMany(models.Flashcard, {
                foreignKey: "collection_id",
            });
        }
    }
    Collection.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            user_id: DataTypes.INTEGER,
            name: DataTypes.STRING,
            description: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: "Collection",
            tableName: "Collection",
            updatedAt: false,
        }
    );
    return Collection;
};
