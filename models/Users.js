const mongoose = require('mongoose');
const moment = require('moment')
const Users = mongoose.Schema({
	password: {
	    type: String,
    },
	address: {
	    type: String
    },
	name: {
		type: String,
	},
	phoneNo: {
	    type: String,
    },
	city: {
	    type: String
    },
    userType:{
	    type:String
    },
	createdAt:{
		type:Date,
		default: moment().format()
	}
	
});

module.exports = mongoose.model('Users', Users);
