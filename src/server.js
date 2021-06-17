var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');

var config = require('../config/config');
require('./models/user');
require('./models/doctor');
require('./models/availableDoctor');
require('./models/registration')
require('./models/blacklist')
require('./models/message');

var indexRouter = require('./routes/index');
var loginRouter = require('./routes/login');
var logoutRouter = require('./routes/logout');
var userRouter = require('./routes/user');
var doctorRouter = require('./routes/doctor');
var registerRouter = require('./routes/register');
var registrationRouter = require('./routes/registration');
var imageRouter = require('./routes/image');
var messageRouter = require('./routes/message');
const mongoose = require('mongoose');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static('public'));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, token");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
  next();
});

app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/logout', logoutRouter);
app.use('/register', registerRouter);
app.use('/user', userRouter);
app.use('/doctor', doctorRouter);
app.use('/registration', registrationRouter);
app.use('/image', imageRouter);
app.use('/chat', messageRouter);

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
    mongoose.connect(config.mongodb_uri, {
        auth:{authdb:"admin"},
        keepAlive: true,
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    console.log('Connect to mongodb successfully');
    return;
}
