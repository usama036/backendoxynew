const Order = require('../models/Order');
const express = require('express');
const router = express.Router();
const isAuthenticated = require('../Middleware/isAthunicated')
const responseGenerator = require('../helper/responseGenerator');
const moment = require('moment');
const tempfile = require('tempfile')
const fs = require('fs')
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



router.get('/export/bill/:id', isAuthenticated, async ( req, res ) => {

    
    const inputs = req.params;
    console.log(inputs.id);
    const records =  await Order.find({
        user: inputs.id, createdAt: {
            $gte: moment().startOf('month').format('YYYY,MM,DD HH:mm:ss'),
            $lte: moment().endOf('month').format('YYYY,MM,DD HH:mm:ss')
        }
    }).populate('user',);
    
    if (!records.length) {
        return res.send('No orders found on specified filters. Please change filters then try again.');
    }

    let workbook = new (require('excel4node')).Workbook();
    let worksheet = workbook.addWorksheet('MrMahir Orders');
    
    let HeadingStyle = workbook.createStyle({
        font: {
            size: 13,
            bold: true,
            color: '#ffffff'
        },
        fill: {
            type: 'pattern',
            patternType: 'solid',
            bgColor: '#999999',
            fgColor: '#999999'
        },
        alignment: {
            horizontal: 'center',
            vertical: 'center'
        },
        border: {
            left: {
                style: 'medium',
                color: '#cccccc'
            },
            right: {
                style: 'medium',
                color: '#cccccc'
            },
            top: {
                style: 'medium',
                color: '#cccccc'
            },
            bottom: {
                style: 'medium',
                color: '#cccccc'
            },
            outline: false
        }
    });
    
    let Headings = [
        ['User Name', 18],
        ['Number', 15],
        ['Address', 50],
        ['City', 16],
        ['Delivery', 16],
        ['Return', 21],
        ['Date', 28],

    ];
    
    worksheet.row(1).setHeight(30);
    Headings.forEach((_head, key) => {
        worksheet.cell(1, (key + 1)).string(_head[0]).style(HeadingStyle);
        worksheet.column((key + 1)).setWidth(_head[1]);
    });
    
    let row = 2;
    
    records.forEach(_order => {
        // worksheet.cell(row, 1).number(
        //     parseInt(createdAt.format('YYMMDD').toString() + ord.get('id').toString())
        // ).style({alignment: {horizontal: 'center'}});
        
        if (_order.user) {
            worksheet.cell(row, 1).string(_order.user.name);
            worksheet.cell(row, 2).string(_order.user.phoneNo);
        }
        
        worksheet.cell(row, 3).string(_order.user.address);
        worksheet.cell(row, 4).string(_order.city);
        worksheet.cell(row, 5).number(_order.bottleDelivery);
        worksheet.cell(row, 6).number(_order.bottleReturn);
        worksheet.cell(row, 7).string(moment(_order.createdAt).format('DD/MM/YYYY'));
        
        row++;
    });
    const buffer = await workbook.writeToBuffer();
    const tempPath = tempfile('.xlsx');
    console.log(tempPath);
    fs.writeFileSync(tempPath, buffer)
    
    
    const mailgun = require("mailgun-js");
    const DOMAIN = 'sandbox81b50885ef754fe39d84512b0a299eef.mailgun.org';
    const mg = mailgun({apiKey: '70d78a5243bb381483d336dc7eb12634-d32d817f-75849f82', domain: DOMAIN});
    const data = {
        from: 'Excited User <unaseer932@gmail.com>',
        to: 'charsitbr@gmail.com',
        subject: `${records[0].user.name} ${moment().format('MMMM-YYYY')}`,
        text: 'Testing some Mailgun awesomness!',
        attachment:tempPath
    };
    mg.messages().send(data, function (error, body) {
        console.log(body);
    });
    res.send('ok')

}),

module.exports = router;
