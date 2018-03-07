		'use strict'
	var bcrypt = require('bcrypt-nodejs');

	var User = require('../models/user');

	function home(req, res){
	res.status(200).send({
		message: 'Prueba de rutas en el servidor nodejs en test' 
	});
}

function test(req, res){
	res.status(200).send({
		message: 'Prueba de rutas en el servidor nodejs'
	});
}

function saveUser(req, res) {
	var params = req.body;
	var user = new User();

	if (params.name && params.surname && params.nick && params.email && params.password){

		user.name = params.name;
		user.surname = params.surname;
		user.nick = params.nick;
		user.mail = params.email;
		user.role = 'ROLE_USER';
		user.image = null;

		// validate nick and mail
		User.find({ $or: [
							{email: user.email},
							{nick: user.nick}
					]}).exec((err, users) => {
						if(err) return res.status(500).send({message:'error en la peticion de usuarios'});

						if(users && users.length >= 1){
							return res.status(200).send({message:'El usuario ya existe!!'});
						}else{
								bcrypt.hash(params.password, null, null, (err, hash) => {
								user.password = hash;

								user.save((err, userStored) => {
									if(err) return res.status(500).send({message:'error al guardar usuario'});

									if (userStored) {
										res.status(200).send({user: userStored});
									}else{
										res.status(404).send({message:'no se ha registrado el usuario'});
									}
								});
							});
						}
					});
				}else{
						res.status(200).send({
							message: 'Todos los campos son obligatorios!!'
						});
					}

}


module.exports = {
	home,
	test,
	saveUser
}
