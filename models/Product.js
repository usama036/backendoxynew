const mongoose = require('mongoose');
const moment = require('moment')
const Product = mongoose.Schema({
    name: {
        type: String
    },
    createdAt: {
        type: new Date,
        default: moment().format()
    }
})
module.exports = mongoose.model('Product', Product);
