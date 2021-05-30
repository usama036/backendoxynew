// const Bus = require('../models/busRegister');
// const stop = require('../models/stops');
const express = require('express')
var router = express.Router()
var moment = require('moment');
var responseGenerator = require('../helper/responseGenerator');

// create and save
router.post('/register', async (req, res) => {
  // Validate request
     try{
    console.log(req.body)

     // Create an Appointment
     const appointment = new Bus({
        busnumber:req.body.busnumber,
        fare:req.body.fare,
        busFrom: req.body.busFrom,
        busTo: req.body.busTo,
        startDate:new Date(req.body.startDate).toISOString().slice(0,10) ,
        select: req.body.select,
        select2: req.body.select2,
        stop:req.body.stop,
        status:req.body.status,
     
     });

     // Save Appointment in the database
     await appointment.save()
     .then(data => {
      return res.status(201).send(responseGenerator(true,'record inster', data, ''))
     }).catch(err => {
      return res.status(400).send(responseGenerator(false, "No " + "amy thing found .", '', ''))
     })
    }catch{
        return res.status(200).send(responseGenerator(false, "Something went wrong" , "", ))


    }


});
router.post('/search',async(req,res)=>{
    console.log(req.body)
    try {
    let record=await Bus.find( { busFrom:{ $regex: new RegExp(req.body.busFrom, "i") },startDate:new Date(req.body.startDate).toISOString().slice(0,10), $and:[
        
        { 'stops.stop':{ $regex: new RegExp(req.body.text, "i") }},
        

    ]})

    if(record.length<1){
        return res.status(500).send(responseGenerator(false, 'no bus found', '', ''));

    }

    return res.status(201).send(responseGenerator(true, 'your records',record))
} catch (err) {
    return res.status(500).send(responseGenerator(false, err, '', ''));
}
})




router.get('/listbus', async (req, res) => {
    try {
        const record = await Bus.find().select({
            "updated": 0,
            '__v': 0
        });
        if (record) {

            return res.status(201).send(responseGenerator(true, 'your records',record))
        } else {
            return res.status(400).send(responseGenerator(false, "No " + ModelKeyword + "s found.", '', ''))
        }
    } catch (err) {
        return res.status(500).send(responseGenerator(false, err, '', ''));
    }
});


router.delete('/deleteBus/:id',async(req,res)=>{

    try {
        const record = await Bus.findOneAndRemove({_id:req.params.id})
        if (record) {

            return res.status(201).send(responseGenerator(true, 'Bus has removed'))
        } else {
            return res.status(400).send(responseGenerator(false, "No " + ModelKeyword + "s found.", '', ''))
        }
    } catch (err) {
        return res.status(500).send(responseGenerator(false, err, '', ''));
    }
})

router.put('/status/:id',async(req,res)=>{

    try {
        const record = await Bus.findOne({_id:req.params.id})
        console.log(record)
        if (record) {
record.status="drop";
record.save().then(data=>{

    return res.status(201).send(responseGenerator(true, 'status update',data))
})
        
        } else {
            return res.status(400).send(responseGenerator(false, "No " + ModelKeyword + "s found.", '', ''))
        }
    } catch (err) {
        return res.status(500).send(responseGenerator(false, err, '', ''));
    }
})



router.put('/activeStatus/:id',async(req,res)=>{



    try {
        const record = await Bus.findOne({_id:req.params.id})
        console.log(record)
        if (record) {
record.status="active";
record.save().then(data=>{

    return res.status(201).send(responseGenerator(true, 'status update',data))
})
        
        } else {
            return res.status(400).send(responseGenerator(false, "No " + ModelKeyword + "s found.", '', ''))
        }
    } catch (err) {
        return res.status(500).send(responseGenerator(false, err, '', ''));
    }
})



router.post('/stops',async(req,res)=>{

    try{
    const appointment = new stop({
       
        time: req.body.time,
        stop:req.body.stop,
    
     
     });

     // Save Appointment in the database
     await appointment.save()
     .then(data => {
      return res.status(201).send(responseGenerator(true,'record inster', data, ''))
     }).catch(err => {
      return res.status(400).send(responseGenerator(false, "No " + "amy thing found .", '', ''))
     })
    }catch{
        return res.status(200).send(responseGenerator(false, "Something went wrong" , "", ))


    }
})

router.get('/stopsList',async(req,res)=>{

    try{
        const record = await stop.find().select({
            "updated": 0,
            '__v': 0
        })
   
     .then(record => {
      return res.status(201).send(responseGenerator(true,'record inster', record, ''))
     }).catch(err => {
      return res.status(400).send(responseGenerator(false, "No " + "amy thing found .", '', ''))
     })
    }catch{
        return res.status(200).send(responseGenerator(false, "Something went wrong" , "", ))


    }
})



router.post('/addStop/:id',async(req,res)=>{
await Bus.findOneAndUpdate({_id: req.params.id }, {$push: {'stops': {
        stop: req.body.stop,
        time: req.body.time,
      
    }}}, {new :true}).then(updatedResturant => {
if(updatedResturant){
    return res.status(201).send(responseGenerator(true, 'decision maker saved successfully.', updatedResturant))
}else{
    console.log(updatedResturant);
    return res.status(400).send(responseGenerator(true, 'Restaurant is not found.', ''))
}
})
})
module.exports=router
