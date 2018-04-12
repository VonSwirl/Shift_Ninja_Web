//Constraints below are dependencies required by this controller.
const bodPars = require('body-parser');
const express = require('express');
const mong = require('mongoose');
var config = require('./config');
const path = require('path');

//Sets up an instance of Express.js .
const expressApp = express();

expressApp.set('views', path.join(__dirname, 'views'));
expressApp.set('view engine', 'pug');

//Connection to my Local Mongodb via mongoose
mong.connect('mongodb://localhost/recruits', { useMongoClient: true });

//Connection to my Mlab connection string Mongodb via mongoose deployment server/
//mong.connect(config.databaseURL, { useMongoClient: true });

//This overrides the depricated mongoose Promise with node.js Promise
mong.Promise = global.Promise;

//Allows Express to use body-parser tool to handle our JSON data.
expressApp.use(bodPars.json());//

//Allows Express access to recruits.js for HTTP verb functions. 
expressApp.use('/recruits', require('./shiftNinjaRoute/recruits'));

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
console.log(config.databaseURL);

//Request Listener
expressApp.listen(3004, function () {
    console.log("Argh! WebApp Listening on Port 3004 Captain");
});
