// Importing required modules
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var expressSession = require("express-session");
const flash = require("connect-flash");

// Importing routes and passport module
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const passport = require('passport');
// const users = require('./routes/users');

// Creating an Express application
var app = express();

// Setting up the view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Configuring middleware for flash messages and session
app.use(flash());
app.use(expressSession({
  resave: false,
  saveUninitialized: false,
  secret: 'bye'  // Secret key for session encryption
}));

// Configuring Passport for authentication
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(usersRouter.serializeUser());
passport.deserializeUser(usersRouter.deserializeUser());

// Configuring middleware for logging, parsing JSON, parsing URL-encoded data, cookies, and serving static files
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Routing configuration
app.use('/', indexRouter);
app.use('/users', usersRouter);

// Middleware to handle 404 errors
app.use(function(req, res, next) {
  next(createError(404));
});

// Error handling middleware
app.use(function(err, req, res, next) {
    // Setting locals, providing error information in development environment
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Rendering the error page
  res.status(err.status || 500);
  res.render('error');
});

// Exporting the Express application
module.exports = app;
