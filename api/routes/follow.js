		'use strict'

	var express = require('express');
	var FollowController = require('../controllers/follow');
	var api = express.Router();
	var md_auth = require('../middleware/authenticated.js');


	api.get('/test-follow', md_auth.ensureAuth, FollowController.prueba);

	module.exports = api;