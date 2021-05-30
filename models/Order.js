const moment = require('moment');
const mongoose = require('mongoose'), Schema = mongoose.Schema

const order = mongoose.Schema({
	city: {
		type: String,
		default: 'sadiqabad',
	},
	user: {
		type: Schema.Types.ObjectId,
		ref: 'Users'
	},
	bottleDelivery:{
		type:Number,
		require
	},
	bottleReturn: {
		type: Number,
		require
	},
	createdAt: {
		type: Date,
		default: moment().format()
	},
	price: {
		type: Number,
		default: 40
	}
	
});

module.exports = mongoose.model('Orders', order);
