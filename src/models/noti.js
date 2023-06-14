"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Noti extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Noti.belongsTo(models.Account, {
                foreignKey: "user_id",
            });
        }
    }
    Noti.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            user_id: DataTypes.INTEGER,
            heading: DataTypes.STRING,
            content: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: "Noti",
            tableName: "Noti",
            updatedAt: false,
        }
    );
    return Noti;
};
