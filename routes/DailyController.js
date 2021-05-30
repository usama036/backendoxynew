const Daily = require('../models/Daily');
const express = require('express');
const router = express.Router();
const isAuthenticated = require('../Middleware/isAthunicated')
const responseGenerator = require('../helper/responseGenerator');
const moment = require('moment');

router.post('/daily/create',isAuthenticated ,async ( req, res ) => {
	const inputs = req.body;
	try {
		const daily = new Daily(inputs);
		await daily.save()
			.then(data => {
				return res.status(201).send(responseGenerator(true, 'daily saved', data));
			}).catch(err => {
				return res.status(400).send(responseGenerator(false, 'No ' + 'amy thing found .', '', ''));
			});
	} catch {
		return res.status(200).send(responseGenerator(false, 'Something went wrong', '',));
	}
});
