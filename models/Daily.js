const mongoose = require('mongoose');
const moment = require('moment');
const Daily = mongoose.Schema({
	expense: {
		type: Number,
		default: 0
	},
	counterSale: {
		type: Number,
		default: 0
	},
	createdAt: {
		type: Date,
		default: moment().format()
	}
	
});

module.exports = mongoose.model('Daily', Daily);
