//Constraints below are dependencies required by this routing file.
const express = require('express');
const rOut = express.Router();
const validateRecruit = require('../controllers/validateDataController.js');
const forwardingService = require('../controllers/recruitsForwardingController.js');

//Retrieves values from JSON objects for data binding. 
//Offers params, nested queries, deep queries, custom reduce/filter functions and simple boolean logic.
var jsonQuery = require('json-query')

//Allows access to our Recruit Data Model
const Recruits = require('../models/recruitsModel.js');

//Allows Parsing, validating, manipulation, and to display dates and times in JS.
const moment = require('moment');

/**
 * 
 */
rOut.post('/newRecruit', function (req, res, next) {
    validateRecruit.isRecruitUnique(req).then(function (recruitValid) {

        if (recruitValid) {
            var recruitBody = req.body;
            
            res.render('viewRecruit', {val: recruitBody});
        }
    }).catch(next);
});

//TODO
//Get a single item to be able to edit prices
rOut.get('/viewRecruitByID/:recID', function (req, res, next) {
    var count = 0;
    //Get their current id and compare to check who they are then call another function
    //console.log(req.params.ean);
    Recruits.findOne({ RecruitRef: req.params.RecruitRef }).then(function (Recruit) {
        var productsList = [];
        var count = 0;
        Recruit.products.forEach(() => {
            productsList.push(Recruit.products[count]);
            count++;
        }, this);
        console.log(count, productsList);
        res.render('viewProductsInRecruit', { productsList });
    }).catch(next);
});

/**
 * 
 * This post recieves and update for a products availablity. It queries the document for 
 * sub-documents with a matching EAN. If fount this sub doc value nowAvailable is set to true.
 */
//TODO
rOut.put('/PurchasingUpdate/', function (req, res, next) {
    validateRecruit.purchasingServUpdateHandler(req).then(function (messageResponse) {
        res.send(messageResponse);

    }).catch(next);
});

/**
 * This returns a view for the staff to see all of a customers Recruits 
 */
//TODO
rOut.get('/displayRecruits/:custoRef', function (req, res, next) {
    Recruits.find({ custoRef: req.params.custoRef }).then(function (Recruit) {
        res.render('viewRecruit', { RecruitList: Recruit });
    }).catch(next);
});

/**
 * This put request receives a update from processing service. The request
 * should contain a customer reference number and also a boolean value.
 * The boolean value sets the customers purchase approvale to true or false
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
