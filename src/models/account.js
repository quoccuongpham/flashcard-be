"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class Account extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Account.hasMany(models.Collection, {
                foreignKey: "user_id",
            });
            Account.hasMany(models.Noti, {
                foreignKey: "user_id",
            });
        }
    }
    Account.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            username: DataTypes.STRING,
            password: DataTypes.TEXT,
            role: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: "Account",
            tableName: "Account",
            updatedAt: false,
        }
    );
    return Account;
};
