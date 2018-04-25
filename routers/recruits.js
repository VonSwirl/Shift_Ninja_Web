//Constraints below are dependencies required by this routing file.
var bodyParser = require('body-parser')
const express = require('express');
const mongoose = require('mongoose');
const rOut = express.Router();
const validateRecruit = require('../controllers/validateDataController.js');
const forwardingService = require('../controllers/recruitsForwardingController.js');
//const dtController = require('../controllers/datatableController.js');


//Retrieves values from JSON objects for data binding. 
//Offers params, nested queries, deep queries, custom reduce/filter functions and simple boolean logic.
var jsonQuery = require('json-query')
//Allows access to our Recruit Data Model
const Recruit = require('../models/recruitsModel.js');
//Allows Parsing, validating, manipulation, and to display dates and times in JS.
const moment = require('moment');

/* var hmm = null;
rOut.get('/view-all', function (req, res, next) {


    Recruit.find({}, function (err, allRecs) {
        console.log(allRecs);
        dtController.allRecruits = allRecs;
        //hmm = JSON.parse(allRecs);
        //Or: 
        //return JSON.parse(JSON.stringify(users));
        console.log(hmm);

        res.send(allRecs);
        //res.render
    });

 Recruit.find().lean().then(function (Recruit) {
         var hmm = JSON.stringify(Recruit);
         //return res.end(JSON.stringify(Recruit));
     }); 

}); 
*/

/**
 * 
 */
rOut.post('/viewRecruits', function (req, res, next) {
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
        console.log('here!');
    });
});

//TODO
//Get a single item to be able to edit prices
rOut.get('/viewRecruitByID/:recID', function (req, res, next) {
    var count = 0;
    //Get their current id and compare to check who they are then call another function
    //console.log(req.params.ean);
    Recruit.findOne({ RecruitRef: req.params.RecruitRef }).then(function (Recruit) {
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

rOut.get('/test', function (req, res, next) {
    res.send("Get happy");
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
