//Constraints below are dependencies required by this controller.
var bodyParser = require('body-parser')
const express = require('express');
const mong = require('mongoose');
var config = require('./config');
const path = require('path');
const expressApp = express();

//This overrides the depricated mongoose Promise with node.js Promise
mong.Promise = global.Promise;

//Allows Express access to recruits.js for HTTP verb functions. 
expressApp.use('/recruits', require('./routers/recruits'));
expressApp.set('view engine', 'pug');

//Connection to my Mlab connection string Mongodb via mongoose deployment server/
var dev = 'development';
var localEnv = 'local';

var useEnv = localEnv;

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

/**
 * Middleware which handles errors on the rejection of a promise
 * @param err this is the error message
 * @param req this is what was requested from the client
 * @param res is the response given back to client
 */
expressApp.use(function (err, req, res, next) {

  //Returns the error in String form to the user 
  res.status(422).send({ error: err.message });
  console.log(err);
});

var port = 9229;

//Request Listener
expressApp.listen(port, function () {
  console.log(">>>> Listening on Port " + port);
});
