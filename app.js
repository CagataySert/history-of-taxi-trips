const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const { protect } = require("./middlewares/protect"); // import middleware
const { login } = require("./api/controllers/auth.controller"); // import auth controller
const tripRouter = require("./api/routes/trip.router");
require("./db/connection"); // import db connection

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

//Middleware
app.use("/api", protect);

//Controllers
app.post("/login", login);

//Routers
app.use("/api/trip", tripRouter);

module.exports = app;
