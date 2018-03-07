		'use strict'
	var bcrypt = require('bcrypt-nodejs');

	var mongoosePaginate = require('mongoose-pagination');

	var User = require('../models/user');

	var jwt = require('../services/jwt');

	function home(req, res){
	res.status(200).send({
		message: 'Prueba de rutas en el servidor nodejs en home' 
	});
}

function test(req, res){
	res.status(200).send({
		message: 'Prueba de rutas en el servidor nodejs'
	});
}

//registro
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
					]}).exec((err, user) => {
						if(err) return res.status(500).send({message:'Error en la peticion de usuarios'});

						if(users && users.length >= 1){
							return res.status(200).send({message:'El usuario ya existe!!'});
						}else{
								bcrypt.hash(params.password, null, null, (err, hash) => {
								user.password = hash;

								user.save((err, userStored) => {
									if(err) return res.status(500).send({message:'Error al guardar usuario'});

									if (userStored) {
										res.status(200).send({user: userStored});
									}else{
										res.status(404).send({message:'No se ha registrado el usuario'});
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

//login
function loginUser(req, res){
	var params = req.body;

	var email = params.email;
	var password = params.password;

	User.findOne({email: email}, (err, user) => {
		if(err) return res.status(500).send({message: 'Error en la peticion'});

		if(user){
			bcrypt.compare(password, user.password, (err, check) => {
				if(check){
					//devolver datos de usuario
					if(params.gettoken){

							// devolver y generar un token

							return res.status(200).send({
									token: jwt.createToken(user)
							});

					}else{
							//devolver datos de usuario
						user.password = undefined;
						return res.status(200).send({user});
					}

				}else{
					return res.status(404).send({message: 'Usuario no identificado'});
				}
			});
		}else{
			return res.status(404).send({message: 'Usuario no identificado'});
		}
	});
}


//conseguir datos de usuario

function getUser(req, res) {
	var userId = req.params.id;

	User.findById(userId, (err, user) => {
		if(err) return res.status(500).send({message: 'Error en la peticion'});

		if(!user) return res.status(404).send({message: 'Usuario no encontrado'});

		return res.status(200).send({user});
	});
}

// paginado de usurios

function getUsers(req, res) {
	var identity_user_id = req.user.sub;
	var page = 1;


	if (req.params.page) {
		page = req.params.page;
	}

	var itemsPerPage = 5;

	User.find().sort('_id').paginate(page, itemsPerPage, (err, users, total) =>{
		if(err) return res.status(500).send({message: 'Error en la peticion'});

		if (!users) return res.status(404).send({message: 'No se encontro  ningun usuario'});
	
		return res.status(200).send({
			users,
			total,
			page: Math.ceil(total/itemsPerPage)
		});
	});
}

// actualizacion de datos

function updateUser(req, res) {
	var userId = req.params.id;
	var update = req.body;

	//borrar password
	delete update.password;

	if (userId != req.user.sub) {
		return res.status(500).send({message: 'No tienes permiso para actualizar los datos'});
	}

	user.findByIdAndUpdate(userId, update, {new:true}, (err, userUpdate) => {
		if(err) return res.status(500).send({message: 'Error en la peticion'});

		if (!userUpdate) return res.status(404).send({message: 'No se ah podido actualizar el usuario'});

		return res.status(200).send({user: userUpdate})
	})
}




module.exports = {
	home,
	test,
	saveUser,
	loginUser,
	getUser,
	getUsers,
	updateUser,
}
