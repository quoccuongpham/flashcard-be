// LIB
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const db = require("./src/models");

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// FILE IMPORT
const auth = require("./src/routes/auth");
const collection = require("./src/routes/collection");

// ROUTE
app.use("/api/auth", auth);
app.use("/api/collection", collection);

app.get("/", async (req, res) => {
    try {
        const account = await db.Account.findAll();
        return res.json(account);
    } catch (error) {
        console.error("Unable to connect to the database:", error);
    }
});

app.listen(process.env.PORT, () => {
    console.log(`Server is running on ${process.env.PORT}`);
});
