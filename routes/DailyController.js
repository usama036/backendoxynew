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

router.get('/daily/list',isAuthenticated ,async ( req, res ) => {
	
	try {
		let dailyRecord = await Daily.find({
			createdAt: {
				$gte: moment().startOf('month').format('YYYY,MM,DD HH:mm:ss'),
				$lte: moment().endOf('month').format('YYYY,MM,DD HH:mm:ss')
			}
		})
		const expense = dailyRecord.reduce(function ( acc, obj ) {
			return acc + obj.expense;
		}, 0)
		const counterSale = dailyRecord.reduce(function ( acc, obj ) {
			return acc + obj.counterSale;
		}, 0)
		
	if(dailyRecord){
		return res.status(201).send(responseGenerator(true, 'daily saved', {dailyRecord,expense,counterSale}));
	}
	
	} catch {
		return res.status(200).send(responseGenerator(false, 'Something went wrong', '',));
	}
});

module.exports = router;
