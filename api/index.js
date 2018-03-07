	'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = 3800;


mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/red_social_angular', {useMongoClient: true})
		.then(() => {
			console.log("La conexion con la base de datos ah sido establecida");
			
			// create server
			app.listen(port, () => {
				console.log("Servidor en linea, ingresa a http://localhost:3800");
			});
		})
		.catch(err => console.log(err));