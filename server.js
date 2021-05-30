const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
// var schedule = require('./schedules/schedule.js');
const UsersController=require ("./routes/UsersController")
const OrderController=require ("./routes/OrderController")
const DailyController=require ("./routes/DailyController")
const bus=require ("./routes/registerbus")
// Create express app
const app = express();
// Set the port to use

const corsOptions = {
    origin: 'https://oxywater.herokuapp.com/',
    optionsSuccessStatus: 200 ,// For legacy browser support
    methods: "GET, PUT, POST"
}

app.use(cors(corsOptions));
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// parse  requests of content-type - application/json
app.use(bodyParser.json());
// activate CORS



app.use('/api/',UsersController)
app.use('/api/',OrderController)
app.use('/api/',DailyController)
app.use('/api/',bus)
// Configuring the database
const dbConfig = require("./config/database.config.js");
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose.set('debug', true);


// Connecting to the database
mongoose
  .connect(
    dbConfig.url,
    {
      useNewUrlParser: true
    }
  )
  .then(() => {
    console.log("Successfully connected to the database");
  })
  .catch(err => {
    console.log("Could not connect to the database. Exiting now...");
    process.exit();
  });

  mongoose.set('useFindAndModify', false)

// Listen for requests
app.listen(process.env.PORT || 5000, function(){
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});
