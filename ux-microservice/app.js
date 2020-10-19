var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var nunjucks = require("nunjucks");

var indexRouter = require("./routes/index");

var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("/public", express.static(path.join(__dirname, "/public")));
app.use(
  "/node_modules/govuk-frontend",
  express.static(path.join(__dirname, "/node_modules/govuk-frontend"))
);

app.use("/", indexRouter);
app.set("views", __dirname + "/views");
app.set("view engine", "njk");

const isDev = app.get("env") === "development";

const nunjucksConfig = {
  autoescape: true,
  noCache: true,
  watch: isDev,
  express: app,
};

const viewPaths = [
  path.join(__dirname, "/node_modules/govuk-frontend"),
  path.join(__dirname, "/views"),
];

nunjucks.configure(viewPaths, nunjucksConfig);

module.exports = app;
