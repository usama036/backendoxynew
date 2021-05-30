const Order = require('../models/Order');
const express = require('express');
const router = express.Router();
const isAuthenticated = require('../Middleware/isAthunicated')
const responseGenerator = require('../helper/responseGenerator');
const moment = require('moment');

router.post('/order/create',isAuthenticated ,async ( req, res ) => {
   const inputs = req.body;
   inputs.price=Number(inputs.price)*Number(inputs.bottleDelivery);
   try {
      const order = new Order(inputs);
      await order.save()
          .then(data => {
             return res.status(201).send(responseGenerator(true, 'Record saved', data));
          }).catch(err => {
             return res.status(400).send(responseGenerator(false, 'No ' + 'amy thing found .', '', ''));
          });
   } catch {
      return res.status(200).send(responseGenerator(false, 'Something went wrong', '',));
   }
});

router.get('/list/Orders', isAuthenticated ,( req, res ) => {
   Order.find().populate('user','phoneNo name')
       .then(orders => {
          return res.status(201).send(responseGenerator(true, 'order list', orders));
   
       }).catch(err => {
      res.status(500).send({
         message: err.message || 'Something went wrong.'
      });
   });
});

router.post('/customer/bill', isAuthenticated, async ( req, res ) => {
    const inputs = req.body;
    let orders = await Order.find({
        user: inputs.user, createdAt: {
            $gte: moment().startOf('month').format('YYYY,MM,DD HH:mm:ss'),
            $lte: moment().endOf('month').format('YYYY,MM,DD HH:mm:ss')
        }
    }).populate('user', 'phoneNo name');
    if ( orders ) {
        const devliery = orders.reduce(function ( acc, obj ) {
            return acc + obj.bottleDelivery;
        }, 0); // 7
        const returns = orders.reduce(function ( acc, obj ) {
            return acc + obj.bottleReturn;
        }, 0); // 7
        const bill = orders.reduce(function ( acc, obj ) {
            return acc + obj.price;
        }, 0)
        
        const remaining = devliery - returns;
        return res.status(201).send(responseGenerator(true, 'order list', {orders,devliery,bill,remaining}));
    }
});

router.get('/test', async ( req, res ) => {
    res.send('works');
});

module.exports = router;
