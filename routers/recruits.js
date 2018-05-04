//Constraints below are dependencies required by this routing file.
const express = require('express');
const mongoose = require('mongoose');
const rOut = express.Router();
const validateRecruit = require('../controllers/validateDataController.js');
const forwardingService = require('../controllers/recruitsForwardingController.js');
const bodyParser = require('body-parser');

//Retrieves values from JSON objects for data binding. 
rOut.use(bodyParser.json());
rOut.use(bodyParser.urlencoded({ extended: true }));
rOut.use(express.static('public'));

//Helps to locate the correct path of files
var path = require('path');

//Allows access to our Recruit Data Model
const Recruit = require('../models/recruitsModel.js');

//Allows Parsing, validating, manipulation, and to display dates and times in JS.
const moment = require('moment');

/**
 * Loads the Home page when app is run
 */
rOut.get('/', function (req, res) {
    res.render('index.pug');
});

/**
 * Renders the addRecruit.pug page to the client-side
 */
rOut.get('/addRecruit', function (req, res) {
    res.render('addRecruit.pug');
});

rOut.post

/**
 * TODO
 */
rOut.post('/login', function (req, res) {
    var user_name = req.body.user;
    var password = req.body.password;
    console.log("User name = " + user_name + ", password is " + password);
    res.end("yes");
});

/**
 * TODO
 */
rOut.get('/recruits', function (req, res) {
    res.render('viewRecruits.pug');
});

/**
 * TODO
 */
rOut.post('/populateViewRecruitsDatatable', function (req, res, next) {
    Recruit.dataTables({
        limit: req.body.length,
        skip: req.body.start,
        order: req.body.order,
        columns: req.body.columns
    }).then(function (table) {
        res.json({
            data: table.data,
            recordsFiltered: table.total,
            recordsTotal: table.total
        });
    });
});

rOut.get('/test', function (req, res, next) {
    res.send("Get happy");
});

//Delete available for future use, not required at this stage.
rOut.delete('', function (req, res, next) {
    res.send(200);
});

module.exports = rOut;
