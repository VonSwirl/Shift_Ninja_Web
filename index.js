//Dependencies required by Shift Ninja Application.
var bodyParser = require('body-parser');
const express = require('express');
const mong = require('mongoose');
var config = require('./config');
const expressApp = express();
const Recruit = require('./models/recruitsModel');
const path = require('path');
var referrerPolicy = require('referrer-policy');
var cors = require('cors');

//This overrides the depricated mongoose Promise with node.js Promise
mong.Promise = global.Promise;

//Allows Express to use body-parser tool to handle our JSON data.
expressApp.use(bodyParser.json());

//Change the apllication enviroment by choosing from the array provided 
var chooseEnviroment = ['development', 'local', 'deploy', 'test'];
var useEnv = chooseEnviroment[0];
process.env.NODE_ENV = useEnv;

//Sets views folder for view pages
expressApp.set('views', path.join(__dirname, 'views'));

//Allows Express access to recruits.js for HTTP verb functions.
expressApp.use('/shiftninja', require('./routers/recruits'));

//Allow App to utilise pug for logic built pages
expressApp.set('view engine', 'pug');

//Connection to DB server depending on enviroment
try {
  mong.connect(config.configURL(useEnv), function (error) {
    if (error) {
      console.log("DB CONNECTION ISSUE");
      console.log(error);

    } else {
      console.log("CONNECTED TO DB. Enviroment => (" + useEnv + ")");
    }
  });
} catch (error) {
  console.log("Check your internet connection");
}

//Populates DB with test data if development/test/local enviroment
if (useEnv != 'deploy') {
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
};

//Cross-origin resource sharing (CORS)
expressApp.use(cors());

//Governs which referrer information is sent in the Referrer header. 
expressApp.use(referrerPolicy({ policy: 'origin-when-cross-origin' }));

/**
 * Middleware which handles errors on the rejection of a promise
 * @param err this is the error message
 * @param req this is what was requested from the client
 * @param res is the response given back to client
 */
expressApp.use(function (err, req, res, next) {
  //Returns the error in String form to the user
  res.header("Content-Security-Policy", "default-src 'self'; script-src 'self' 'https://apis.google.com'; Referrer-Policy 'origin-when-cross-origin';object-src 'none';img-src 'self' 'https:' 'data:';media-src 'self';frame-src 'https://www.google.co.uk/maps/';font-src 'self' 'https://www.w3.org/';connect-src 'self';style-src 'self' 'https://fonts.googleapis.com/';");
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'DELETE, PUT, GET, POST');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.status(422).send({ error: err.message });
  console.log(err, req, res);
});

//Set Port
var port = 3000;

//Request Listener
expressApp.listen(port, function () {
  console.log(">>>> Listening on Port " + port);
});