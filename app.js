var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var apiRouter = require('./routes/api');
var app = express();

var cors = require('cors');

const corsWhiteList = (process.env.CORSLIST || '').split('|');
const corsOptions = {
    origin: (origin, next) => {
        console.log('CORS origin:', origin);
        if (corsWhiteList.includes(origin)) {
            next(null, true);
        } else {
            next(new Error('Not Allowed by Cors Policy'));
        }
    },
};

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors(corsOptions));

app.use('/', indexRouter);
app.use('/api', apiRouter);

module.exports = app;
