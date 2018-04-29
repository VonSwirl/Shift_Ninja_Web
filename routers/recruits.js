//Constraints below are dependencies required by this routing file.
const express = require('express');
const mongoose = require('mongoose');
const rOut = express.Router();
const validateRecruit = require('../controllers/validateDataController.js');
const forwardingService = require('../controllers/recruitsForwardingController.js');

//Helps to locate the correct path of files
var path = require('path');

//Retrieves values from JSON objects for data binding. 
var bodyParser = require('body-parser');

//Allows access to our Recruit Data Model
const Recruit = require('../models/recruitsModel.js');

//Allows Parsing, validating, manipulation, and to display dates and times in JS.
const moment = require('moment');

/**
 * TODO
 */
rOut.get('/', function (req, res) {
    res.sendFile(path.resolve('./views/login.html'));
});

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
rOut.post('/viewAllRecruits', function (req, res, next) {
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

/**
 * TODO
 */
rOut.post('/viewRecruitDetails/:recID', function (req, res, next) {
    Recruit.findOne({ RecruitRef: req.params.RecruitRef }).then(function (Recruit) {
        console.log(Recruit);
        res.render('recruitDetails', { Recruit });
    }).catch(next);
});

/**
 * TODO
 */
rOut.put('/PurchasingUpdate/', function (req, res, next) {
    validateRecruit.purchasingServUpdateHandler(req).then(function (messageResponse) {
        res.send(messageResponse);

    }).catch(next);
});

/**
 * TODO
 */
rOut.get('/displayRecruits/:custoRef', function (req, res, next) {
    Recruits.find({ custoRef: req.params.custoRef }).then(function (Recruit) {
        res.render('viewRecruit', { RecruitList: Recruit });
    }).catch(next);
});

rOut.get('/test', function (req, res, next) {
    res.send("Get happy");
});

/**
 * TODO
 */
rOut.put('/CustomerApprovalUpdate', function (req, res, next) {
    forwardingService.customerAuthUpdate(req.param.id, req.query.approved)
        .then(function (messageResponse) {
            res.send(messageResponse);

        }).catch(next);
});

//Delete available for future use, not required at this stage.
rOut.delete('', function (req, res, next) {
    res.send(200);
});

module.exports = rOut;
