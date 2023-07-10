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
const flashcard = require("./src/routes/flashcard");
const memorize = require("./src/routes/memorize");

// ROUTE
app.use("/api/auth", auth);
app.use("/api/collection", collection);
app.use("/api/flashcard", flashcard);
app.use("/api/memorize", memorize);

app.get("/", (req, res) => {
    res.json({
        message: "welcome to flashcard",
    });
});
app.listen(process.env.PORT, () => {
    console.log(`Server is running on ${process.env.PORT}`);
});
