var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var config = require('../config/config');
require('./models/user');
require('./models/doctor');

var indexRouter = require('./routes/index');
var loginRouter = require('./routes/login');
var userRouter = require('./routes/user');
var doctorRouter = require('./routes/doctor');
var registerRouter = require('./routes/register');
var registrationRouter = require('./routes/registration');
const mongoose = require('mongoose');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/register', registerRouter);
app.use('/user', userRouter);
app.use('/doctor', doctorRouter);
app.use('/registration', registrationRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


connect();

module.exports = app;

function connect() {
  mongoose.connection
    .on('error', console.log)
    .on('disconnected', connect)
  return mongoose.connect(config.mongodb_uri, {
    keepAlive: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
}
