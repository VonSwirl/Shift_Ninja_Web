//Constraints below are dependencies required by this routing file.
const express = require('express');
const mongoose = require('mongoose');
const rOut = express.Router();
const validateRecruit = require('../controllers/validateDataController.js');
const forwardingService = require('../controllers/recruitsForwardingController.js');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const passport = require('passport');

//Allows access to our Recruit Data Model
const Recruit = require('../models/recruitsModel');
const Admin = require('../models/adminsModel');

//Retrieves values from JSON objects for data binding. 
rOut.use(bodyParser.json());
rOut.use(bodyParser.urlencoded({ extended: true }));
rOut.use(express.static('public'));

//Helps to locate the correct path of files
var path = require('path');

//Allows Parsing, validating, manipulation, and to display dates and times in JS.
const moment = require('moment');

/**
 * Loads the Home page when logged in
 */
rOut.get('/', function (req, res) {
    res.render('index.pug');
});

/**
 * Loads the Login page when app runs
 */
rOut.get('/login', function (req, res) {
    req.flash('success', 'You are now registered and can log in');
    res.render('login');
});

rOut.post('/loginData', function (req, res, next) {
    passport.authenticate('local', {
        successRedirect: '/shiftninja',
        failureRedirect: '/shiftninja/login'
    })(req, res, next);
});

/**
 * Renders the addRecruit.pug page to the client-side
 */
rOut.get('/addRecruit', function (req, res) {
    res.render('addRecruit.pug');
});

rOut.post('/newRecData', function (req, res) {
    const title = req.body.title;
    const fName = req.body.fName;
    const sName = req.body.sName;
    const forName = req.body.forName;
    const address = req.body.address;
    const mobileN = req.body.mobileN;

    req.checkBody('title', 'Title is required').notEmpty();
    req.checkBody('fName', 'First Name is required').notEmpty();
    req.checkBody('sName', 'Surname is required').notEmpty();
    req.checkBody('address', 'Address is required').notEmpty();
    req.checkBody('mobileN', 'Mobile Number is required').notEmpty();

    let errors = req.validationErrors();

    if (errors) {
        res.render('addRecruit', {
            errors: errors
        });
    } else {
        var data = [];
        var i = Math.random();
        data.push({
            recID: "" + i,
            recRecruitRef: sName + i,
            recTitle: title,
            recFirstN: fName,
            recSurN: sName,
            recForeN: forName,
            recAddress: address,
            recMobile: mobileN,
            recActive: "true",
            recExperience: "Experieance Here",
            recProfilePic: {
                picData: "0000", picName: "Lovely Picture"
            },
            allQuals: [
                {
                    qualID: "811111",
                    qualTitle: "shite",
                    qualDateAdded: "Sun, Nov26,2017 10: 20 PM",
                    qualObject: {
                        qualData: "1111", qualFileNameTwo: "QFName"
                    }
                },
                {
                    qualID: "82222",
                    qualTitle: "more shite",
                    qualDateAdded: "Sun, Nov26, 2017 11: 20 PM",
                    qualObject: {
                        qualData: "0000", qualFileNameTwo: "QFName"
                    }
                }
            ],
            allShifts: [
                {
                    shiftID: "9111",
                    shiftCompanyName: "Company N1",
                    shiftAddress: "N1 here address",
                    shiftRole: "role",
                    shiftStart: "Mon, Nov27, 2017 06: 20 AM",
                    shiftEnd: "Mon, Nov27, 2017 07: 20 AM",
                    shiftRateCode: "1",
                    shiftPay: "100"
                },
                {
                    shiftID: "9222",
                    shiftCompanyName: "Company N2",
                    shiftAddress: "N2 here address",
                    shiftRole: "role",
                    shiftStart: "Mon, Nov27, 2017 10: 20 AM",
                    shiftEnd: "Mon, Nov27, 2017 11: 20 AM",
                    shiftRateCode: "2",
                    shiftPay: "200"
                }
            ]
        })
        req.flash('Success', 'New recruit added');
        res.redirect('/addRecruit');
        errors: errors
    }
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
