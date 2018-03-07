	'use strict'

var express = require('express');
var bodyParser = require('body-parser');
var app = express();

//load routes
var user_routes = require('./routes/user');

//middelwares

 app.use(bodyParser.urlencoded({extended:false}));
 app.use(bodyParser.json());


//cors


//routes

app.use('/api', user_routes);

//exports

module.exports = app;
