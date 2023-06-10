require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const db = require("./src/models");
const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

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
