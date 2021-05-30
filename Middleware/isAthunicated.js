/**
 * @copyright MrMahir Pvt Ltd - https://mrmahir.com
 * @author Junaid Atari <mj.atari@gmail.com>
 * @since 2021-05-25
 */

// Authorization Rules Middleware
// authMiddleware.js
const jwt = require('jsonwebtoken');
const responseGenerator = require('../helper/responseGenerator');
let config=require('../config')
const Users = require('../models/Users');


const isUserAuthenticated = (req, res, next) => {
	
	
	let token=''
	const authHeader = req.headers.authorization;
		const parted = authHeader.split(' ');
		if (parted.length === 2) {
			token = parted[1];
		}
		if (token) {
			
			jwt.verify(token, config.secret,async function (err, decoded) {
				if (decoded ) {
					let record =await Users.findOne({_id:decoded.id})
					if(record?.userType !== 'admin'){
						return res.status(201).send(responseGenerator(false, 'UNAUTHORIZED token', '', ''));
					}else{
						next()
					}
				} else {
					res.status(401).send(responseGenerator(false, 'You dont have admin permissions to move forword.', '', '')
					);
				}
			});
			
			
		} else {
			return res.status(403).send(responseGenerator(false, 'UNAUTHORIZED token', '', ''));
		}
	
}

module.exports = isUserAuthenticated;


// const jwt = require('jsonwebtoken');
// const config = require('../db');
// const responseGenerator = require('../_helpers/mobileResponseGenerator');


// const isAdmin=async(req,res,next)=>{
//     try{
//         const authHeader = req.headers.authorization;
//         if (!authHeader) {
//             return res.status(403).send(responseGenerator(false, 'Something went wrong', '', ''));
//         } else {
//             const parted = authHeader.split(' ');
//             if (parted.length === 2) {
//                 const token = parted[1];
//             } else {
//                 return res.status(401).send(responseGenerator(false, 'Unauthorized token', '', ''));
//             }
//             if (token) {
//                 jwt.verify(token, config.secret, function (err, decoded) {
//                     if (decoded && decoded.role == 'Admin') {
//                         next()
//                     } else {
//                         res.status(404).send(responseGenerator(false, 'You dont have admin permissions to move forword.', '', '')
//                         );
//                     }
//                 });
//             }
//         }
//     }catch(err){
//         return res.status(401).send(responseGenerator(false, err.toString(), '', ''));
//     }
// };



