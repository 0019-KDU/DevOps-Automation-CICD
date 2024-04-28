const express = require("express");
const bodyParser = require("body-parser");
const routes = require("./routes/expense");

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Routes
app.use("/api", routes);

module.exports = app;
