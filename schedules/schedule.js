var cron = require("node-cron");
const Appointment = require("../models/appointment.model.js");
var moment = require("moment");

module.exports = {
  cleanDBSchedule: function() {
    console.log("starting the cleanDBSchedule");

    cron.schedule("30 2 * * *", () => {
      // Generate the date from 7 days from today
      let weekEarlier = moment().subtract(7, "days");

      // Delete all appointment one week old
      Appointment.deleteMany(
        { fromReact: true, createdAt: { $lte: weekEarlier } },
        function(err) {}
      );

      // Delete all apointment not from React and recreate it with its base value
      // Delete
      Appointment.deleteMany({ fromReact: { $exists: false } }, function(
        err
      ) {});

      // Create an Array
      let appointments = [
        {
          name: "Jean Larquy",
          phone: "04 22 12 15 75",
          time: "Sun Sep 01 2018 20:30",
          desc: "Painting"
        },
        {
          name: "Damon John",
          phone: "06 87 79 78 76",
          time: "Tue Sep 10 2018 11:30",
          desc: "Oil Filter"
        },
        {
          name: "Johnny Grazzia",
          phone: "04 56 78 98 78",
          time: "Mon Sep 09 2018 09:30",
          desc: "Tires"
        },
        {
          name: "Valery Destalle",
          phone: "06 87 87 98 87",
          time: "Fri Sep 13 2018 13:30",
          desc: "Revision"
        }
      ];

      // Save the Array in the database
      appointments.forEach(a => {
        Appointment.create(a, function(err, small) {
          if (err) return handleError(err);
        });
      });
    });
  }
};
