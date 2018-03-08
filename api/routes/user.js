		'use strict'

	var express = require('express');
	var UserController = require('../controllers/user');
	var md_auth = require('../middleware/authenticated');

	var api = express.Router();
	var multipart = require('connect-multiparty');
	var md_upload = multipart({uploadDir: './uploads/users'});

	api.get('/home', UserController.home);
	api.get('/test', md_auth.ensureAuth, UserController.test);
	api.post('/register', UserController.saveUser);
	api.post('/login', UserController.loginUser);
	api.get('/user/:id', md_auth.ensureAuth, UserController.getUser);
	api.get('/users/:page?', md_auth.ensureAuth, UserController.home);
	api.put('/update-user/:id', md_auth.ensureAuth, UserController.updateUser);
	api.post('/upload-image-user/:id', [md_auth.ensureAuth, md_upload], UserController.uploadImage);

	module.exports = api;