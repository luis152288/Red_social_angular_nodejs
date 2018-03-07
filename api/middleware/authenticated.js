		'use strict'

	var jwt = require('jwt-simple');
	var moment = require('moment');
	var secret = 'socia_angular_node';

	exports.ensureAuth = function(req, res, next) {
		if(!req.headers.authorization){
			return res.status(403).send({message: 'La peticion no contiene datos de autenticacion'});
		}

		var token = req.headers.authorization.replace(/['"]+/g, '');

		try{

		var payload = jwt.decode(token, secret);

		if(payload.exp <= moment().unix()){
			return res.status(401).send({
				message: 'El token ah expirado'
				});
			}

		}catch(ex){
			return res.status(404).send({
				message: 'El token es invalido'
				});
		}

		req.user = payload;

		next();
	}