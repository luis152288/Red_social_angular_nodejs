		'user strict'

	//var path = require('path');
	//var fs = require('fs');
	var mongoosePaginate = require('mongoose-pagination');

	var user = require('../models/user');
	var Follow = require('../models/follow');

 //seguimiento de usuarios

	function saveFollow(req, res) {
		var params = req.body;

		var follow = new Follow();

		follow.user = req.user.sub;
		follow.followed = params.followed;

		follow.save((err, followStored) => {
			if (err) return res.status(500).send({message:'Error en el seguimiento'});

			if(!followStored) return res.status(404).send({message: ' El seguimiento no se ah guardado'});

			return res.status(200).send({follow:followStored});
		});
 		
	}

	//Dejar de sguir a otro usuario

	function deleteFollow(req, res) {
		var userId = req.user.sub;
		var followId = req.params.id;

		follow.find({'user': userId, 'followed':followId}).remove(err => {
			if(err) return res.status(500).send({message:'Error al Dejar de seguir'});

			return res.status(200).send({message: ' ah dejado de seguir a...'});
		})
	}


	function getFollowingUsers(req, res) {
		 var user = req.user.sub;

		 if (req.params.id && req,params.page){
		 	userId = req.params.id;

		 }

		 var page = 1

		 if (req.params.page) {
		 	page = req.params.page;

		 }else{
		 	page = req.params.id;

		 }

		 var itemsPerPage = 4;

		 Follow.find({user:userId}).populate({path: 'followed'}).paginate(page, itemsPerPage, (err, follows, total) =>{
		 		if(err) return res.status(500).send({message:'Error en el servidor'});

		 		if (!follows) return res.status(404).send({ message: 'No estas siguiendo a ningun usuario'});

		 		return res.status(200).send({
		 			total: total,
		 			pages: Math.ceil(total/itemsPerPage),
		 			follows
		 		})

		 });
	}


	module.exports = {
		saveFollow,
		deleteFollow,
		getFollowingUsers
	}