var createError = require("http-errors");
var express = require("express");
var session = require('express-session');
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var passport = require('passport');
var passportBearerStrategy = require('passport-http-bearer').Strategy;
const { CosmosDbTableStore } = require('nodejs-cosmosdbtable-session');
import { TableClient } from "@azure/data-tables";
import * as cors from "cors";
import "reflect-metadata";

require('dotenv').config();

var app = express();

app.set('view engine', 'jade');
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());

const tableName = `SessionTable`;
const client = TableClient.fromConnectionString(
    process.env.COSMOSDBTABLE_CONNECTIONSTRING,
    tableName);

app.use(
  session({
    store: new CosmosDbTableStore({
      tableClient: client,
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

passport.use(new passportBearerStrategy(
  function(token, cb) {
    if(token === process.env.API_TOKEN)
  	  return cb(null, {id:-1, name: 'api-token'});
    else 
      return cb(new Error("Unauthorized"));
  }
));

var indexRouter = require("./routes/index");
app.use("/", indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

export default app;
