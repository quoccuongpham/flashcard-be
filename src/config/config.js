const fs = require("fs");
require("dotenv").config();
module.exports = {
    development: {
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        host: "127.0.0.1",
        dialect: "postgres",
    },
    test: {
        username: "root",
        password: null,
        database: "database_test",
        host: "127.0.0.1",
        dialect: "postgres",
    },
    production: {
        username: process.env.PRODUCT_DB_USERNAME,
        password: process.env.PRODUCT_DB_PASSWORD,
        database: process.env.PRODUCT_DB_NAME,
        host: process.env.PRODUCT_DB_HOST,
        dialect: "postgres",
    },
};
