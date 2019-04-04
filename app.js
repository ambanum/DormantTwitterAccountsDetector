require('dotenv').config();
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const i18n = require('i18n');
mongoose.connect(process.env.MONGO_URL);

const indexRouter = require('./routes/index');

const app = express();

i18n.configure({
    // setup some locales - other locales default to en silently
    locales: ['en', 'fr'],
   
    // sets a custom cookie name to parse locale settings from
    cookie: 'DormantTwitterAccountsDetector_locale',
   
    // where to store json files - defaults to './locales'
    directory: __dirname + '/locales'
  });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(i18n.init);

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
