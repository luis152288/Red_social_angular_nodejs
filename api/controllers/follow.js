		'user strict'

	//var path = require('path');
	//var fs = require('fs');
	var mongoosePaginate = require('mongoose-pagination');

	var user = require('../models/user');
	var Follow = require('../models/follow');

	function prueba(req, res) {
		res.status(200).send({message: 'hola mundo desde follow'});
		
	}

	module.exports = {
		prueba
	}