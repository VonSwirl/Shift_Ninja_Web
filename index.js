//Constraints below are dependencies required by this controller.
var bodyParser = require('body-parser')
const express = require('express');
const mong = require('mongoose');
var config = require('./config');
const expressApp = express();
const Recruit = require('./models/recruitsModel');

//This overrides the depricated mongoose Promise with node.js Promise
mong.Promise = global.Promise;

expressApp.use(bodyParser.json());
expressApp.use(bodyParser.urlencoded({
  extended: true
}));

//Allows Express access to recruits.js for HTTP verb functions.
expressApp.use('/recruits', require('./routers/recruits'));

//Connection to my Mlab connection string Mongodb via mongoose deployment server/
var dev = 'development';
var localEnv = 'local';
var useEnv = dev;

//mong.connect(config.configURL(dev), { useMongoClient: true });
mong.connect(config.configURL(useEnv), { useMongoClient: true }, function (error) {
  if (error) {
    console.log("\n!!!!======DB CONNECTION ISSUE============!!!!\n"
      + "!!!!======Has MongoDB been executed?=====!!!!\n");
    console.log(error);
  } else {
    console.log(">>>> CONNECTED TO DB. Enviroment => (" + useEnv + ") >>>>>>>>>");
  }
});

Recruit.find({}, function (err, recsInDB) {
  if (!recsInDB.length) {
    var data = []
    for (var i = 1; i <= 1000; i++) {
      data.push({
        recID: "" + i,
        recRecruitRef: "arEcRuItRefRightErr" + i,
        recTitle: "Mr." + i,
        recFirstN: "Johnny" + i,
        recSurN: "Smithie" + i,
        recForeN: "Nelson" + i,
        recAddress: "1" + i + "Downing Street, London, TW1 1AB",
        recMobile: "+44745297772" + i,
        recActive: "true",
        recExperience: "Experieance Here" + i,
        recProfilePic: {
          picData: "0000" + i, picName: "Lovely Picture" + i
        },
        allQuals: [
          {
            qualID: "811111" + i,
            qualTitle: "shite" + i,
            qualDateAdded: "Sun, Nov26,2017 10: 20 PM",
            qualObject: {
              qualData: "1111" + i, qualFileNameTwo: "QFName" + i
            }
          },
          {
            qualID: "82222" + i,
            qualTitle: "more shite" + i,
            qualDateAdded: "Sun, Nov26, 2017 11: 20 PM",
            qualObject: {
              qualData: "0000" + i, qualFileNameTwo: "QFName" + i
            }
          }
        ],
        allShifts: [
          {
            shiftID: "9111" + i,
            shiftCompanyName: "Company N1" + i,
            shiftAddress: "N1 here address" + i,
            shiftRole: "role" + i,
            shiftStart: "Mon, Nov27, 2017 06: 20 AM",
            shiftEnd: "Mon, Nov27, 2017 07: 20 AM",
            shiftRateCode: "1" + i,
            shiftPay: "100" + i
          },
          {
            shiftID: "9222" + i,
            shiftCompanyName: "Company N2" + i,
            shiftAddress: "N2 here address" + i,
            shiftRole: "role" + i,
            shiftStart: "Mon, Nov27, 2017 10: 20 AM",
            shiftEnd: "Mon, Nov27, 2017 11: 20 AM",
            shiftRateCode: "2" + i,
            shiftPay: "200" + i
          }
        ]
      })
    };
    Recruit.create(data, function (err) { console.log(err) });
  }
});

/**
 * Middleware which handles errors on the rejection of a promise
 * @param err this is the error message
 * @param req this is what was requested from the client
 * @param res is the response given back to client
 */
expressApp.use(function (err, req, res, next) {

  //Returns the error in String form to the user 
  res.status(422).send({ error: err.message });
  console.log(err, req, res);
});

//Set Port
var port = 3000;

//Request Listener
expressApp.listen(port, function () {
  console.log(">>>> Listening on Port " + port);
});