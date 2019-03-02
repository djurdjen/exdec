var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var bodyParser = require("body-parser");
var api = require("./routes");
var passport = require("passport");

var app = express();

// view engine setup
app.use(passport.initialize());
app.use(passport.session());
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// set static directory
app.use(express.static(path.join(__dirname, "dist")));

// set view options
app.set("view options", { layout: false });

// define api route
app.use("/api", api);

// Route wildcard for Vue application
app.get("/*", function(req, res) {
  res.sendFile(path.join(__dirname, "dist") + "/index.html");
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

module.exports = app;
