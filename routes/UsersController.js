const Users = require('../models/Users');
const express = require('express');
const router = express.Router();
const isAuthenticated = require('../Middleware/isAthunicated')
const responseGenerator = require('../helper/responseGenerator');
const config = require('../config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const saltRounds = 10;

// router.get('/csrfToken', function (req, res) {
//     // pass the csrfToken to the view
//     res.json( { _csrf: req.csrfToken() })
// })

// create and save
router.post('/user/new', async ( req, res ) => {
	// Validate request
	try {
		
		const record = await Users.findOne({phoneNo: req.body.phoneNo});
		if ( record ) {
			return res.status(200).send(responseGenerator(false, 'phoneNo already exist', '',));
			
		}
		const securePassword = await hashPassword(req.body.password);
		console.log(securePassword);
		// Create an user
		const user = new Users({
			password: securePassword,
			address: req.body.address,
			city: req.body.city,
			phoneNo: req.body.phoneNo,
			name: req.body.name,
			userType: req.body.userType,
		});
		
		// Save user in the database
		await user.save()
			.then(data => {
				return res.status(201).send(responseGenerator(true, data, ''));
			}).catch(err => {
				return res.status(400).send(responseGenerator(false, 'No ' + 'amy thing found .', '', ''));
			});
	} catch {
		return res.status(200).send(responseGenerator(false, 'Something went wrong', '',));
		
	}
	
});

router.post('/login', async ( req, res ) => {
	try{
	const record = await Users.findOne({phoneNo: req.body.phoneNo});
	if ( !record ) {
		return res.status(201).send(responseGenerator(false, 'email not found', ''));
	}
	const status = await checkPassword(req.body.password, record.password);
	if ( status ) {
		const payload = {
			id: record._id,
			phoneNo: record.phoneNo,
			userType: record.userType,
		};
		jwt.sign(payload, config.secret, {
			expiresIn: 14400
		}, ( err, token ) => {
			if ( err ) {
				return res.status(400).send(responseGenerator(false, 'No token found ' + ' ', '', ''));
			}
			res.json({
				status: true,
				data: record,
    
				token: `Bearer ${token}`
			});
		});
	} else {
		return res.status(200).send(responseGenerator(false, 'password not match'));
	}
 } catch(err){
    return res.status(400).send(responseGenerator(false, "No " + "amy thing found .", '', ''))
}

});

// Retrieve and return all
router.get('/list/users', isAuthenticated ,( req, res ) => {
	Users.find()
		.then(appointments => {
			res.send(appointments);
		}).catch(err => {
		res.status(500).send({
			message: err.message || 'Some error occurred while retrieving appointments.'
		});
	});
});

// Find one by ID
router.get('/appointments/:appointmentId', ( req, res ) => {
	Appointment.findById(req.params.appointmentId)
		.then(appointment => {
			if ( !appointment ) {
				return res.status(404).send({
					message: 'Appointment not found with id ' + req.params.appointmentId
				});
			}
			return res.status(201).send(responseGenerator(true, 'data found', appointment));
			
		}).catch(err => {
		if ( err.kind === 'ObjectId' ) {
			return res.status(404).send({
				message: 'Appointment not found with id ' + req.params.appointmentId
			});
		}
		return res.status(500).send({
			message: 'Error retrieving appointment with id ' + req.params.appointmentId
		});
	});
});

// Update a appointment identified by the appointmentId in the request
router.post('/appointments/:appointmentId', ( req, res ) => {
	
	// Validate Request
	if ( !req.body.email ) {
		return res.status(400).send({
			message: 'Appointment content can not be empty'
		});
	}
	// Find appointment and update it with the request body
	Users.findByIdAndUpdate(req.params.appointmentId, {
			email: req.body.email,
			password: req.body.password,
			select: req.body.select,
			address: req.body.address,
			phone: req.body.phone,
			city: req.body.city,
			zip: req.body.zip,
		}, {new: true})
		.then(appointment => {
			if ( !appointment ) {
				return res.status(404).send({
					message: 'Appointment not found with id ' + req.params.appointmentId
				});
			}
			return res.status(201).send(responseGenerator(true, 'update', appointment));
		}).catch(err => {
		if ( err.kind === 'ObjectId' ) {
			return res.status(200).send(responseGenerator(false, 'not update'));
			
		}
		return res.status(500).send({
			message: 'Error updating appointment with id ' + req.params.appointmentId
		});
	});
});

// Delete
router.delete('/appointments/:appointmentId', ( req, res ) => {
	Users.findByIdAndRemove(req.params.appointmentId)
		.then(appointment => {
			if ( !appointment ) {
				return res.status(404).send({
					message: 'Appointment not found with id ' + req.params.appointmentId
				});
			}
			return res.status(201).send(responseGenerator(true, 'Appointmend deleted', ''));
		}).catch(err => {
		if ( err.kind === 'ObjectId' || err.name === 'NotFound' ) {
			return res.status(404).send({
				message: 'Appointment not found with id ' + req.params.appointmentId
			});
		}
		return res.status(500).send({
			message: 'Could not delete appointment with id ' + req.params.appointmentId
		});
	});
});

async function hashPassword ( password ) {
	const hash = bcrypt.hashSync(password, saltRounds);
	return hash;
}

async function checkPassword ( username, password ) {
	const match = await bcrypt.compare(username, password);
	if ( match ) {
		return true;
	} else {
		return false;
	}
}

module.exports = router;



