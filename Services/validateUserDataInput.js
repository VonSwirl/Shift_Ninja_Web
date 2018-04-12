
//Allows Parsing, validating, manipulation, and to display dates and times in JS.
const moment = require('moment');
const Recruit = require('../domainModels/recruitsModel.js');
const forwardingService = require('./recruitsForwardingService.js');

/**
 * @description 
 * The purpose of this function is to establish if the post request Recruit ID 
 * matches an existing document in the Recruit database.
 * This function is called by shiftNinjas.js rOut.post('/newRecruit',function(req,res,next)
 * @param {JSON} newRecruitData This is the res.body passed in by the post request /newRecruit.
 */
function isRecruitUnique(newRecruitData) {
    return new Promise(function (resolve, reject) {
        var validRef = newRecruitData.body.recID;

        if (validRef != null) {
            newRecruitData.body.recID = validRef;

            //This section creates a unique Recruit ID base on inputted data.
            var partTwo = moment().format('DDMMYYhm');
            var unique = validRef + partTwo;

            //Checks if there is already a Recruit with this same reference number.
            Recruit.count({ recID: unique }, function (err, count) {

                if (count > 0) {
                    //Scans for a matching recID in db.
                    reject('Recruit ID Already In Use. Please try again');

                } else {
                    //newRecruitData.body.recAddedDate = moment().format('llll');
                    //newRecruitData.body.recID = unique;
                    saveNewRecruitToMongo(newRecruitData);
                    resolve(true);
                }

            }).catch(function (err) {
                reject('There is a problem trying to count Recruits by recID.', err);

            })
        } else {
            resolve('No recID provided. Please ensure you have provided the correct recID');
        }
    })
}

/**
 * @description This function looks for any products which need to be Recruited. If Recruit forfilled then
 * Recruit is forwarded to invoicing service otherwise it is sent to purchasing service to forfill required stock. 
 * @function checkRecruitsProductsStocked(recruitsData) 
 * @param {JSON} recruitsData This is the res.body passed in by the isRecruitUnique fn.
 */
function checkIfProductsStocked(recruitsData) {
    try {
        var missingStock = { recID: recruitsData.body.RecruitRef, itemsRequired: [] };
        var totalValue = 0.0;

       // var queryRecruit = recruitsData.body.products;
       // queryRecruit.forEach(function (element) {
            //var qReq = parseInt(element.qtyReq);
            //var value = (element.productPrice * qReq);
            //totalValue = (totalValue + value);
            //recruitsData.body.RecruitTotal = totalValue;
            //var sQty = parseInt(element.stockQty);

            //This compares the stock vs the Recruit requirement and sets
            //boolean available if the products are in stock. 
            //if (qReq <= sQty) {
            //    element.nowAvailable = true;

            //} else {
            //    var RecruitMoreStock = (qReq - sQty);
            //    element.nowAvailable = false;
            //    var ofEAN = element.ean;
            //    missingStock.itemsRequired.push({ "ean": ofEAN, "number": RecruitMoreStock });
            //}
            // }, this);

        newRecruitForwarding(recruitsData
            //, missingStock
        );

    } catch (error) {
        console.log('error @ checkIfProduct fn ' + error);
    }
}

/**
 * @description
 * This function is called by Fn checkIfProductsStocked(). This runs inline with a new Recruit creation.
 * The purpose of this function is to query the missingStock array to determine if it is ready
 * for the invoicing service to complete the Recruit or whether it requires more products. If the 
 * latter is true then then Recruit is pass to the purchasing service. 
 * @function RecruitForwarding(recruitD,mS)
 * @param {JSON} recruitD aka(recruitsData) This is the modified res.body passed in by Fn checkIfProductsStocked
 * @param {Array} mS aka(MissingStock) Is a list of all product Ean numbers and quantity missing from the Recruit.
 */
function newRecruitForwarding(recruitD, mS) {
    if (mS.itemsRequired.length == []) {
        recruitD.body.stocked = true;
       recruitD.body.RecruitStatus = "Complete";
        saveNewRecruitToMongo(recruitD);
        forwardingService.sendRecruitToInvoicing(recruitD);

    } else {
        recruitD.body.stocked = false;
        recruitD.body.RecruitStatus = "Waiting for Stock";
        console.log('Missing Stock--------\n', mS, '\n');
        saveNewRecruitToMongo(recruitD);
        forwardingService.sendRecruitToPurchasingService(mS);
    }
}

/**
 * @description
 * The purpose of this function is to save a prevalidated Recruit to the Mongo Database 
 * @function RecruitForwarding(RecruitD)
 * @param {JSON} RecruitD aka(recruitsData) This is the modified res.body passed in by Fn RecruitForwarding.
 */
function saveNewRecruitToMongo(RecruitD) {
    try {
        //If there is no existing Recruit with reference matching then 
        //the Recruit is created
        Recruit.create(RecruitD.body);
        console.log('New Recruit saved to db', RecruitD.body);

    } catch (error) {
        console.log('error @ savingRecruit');

    }
}

/**
 * @function confirmAllStockAvailableForInvoicing
 * @description
 * This Fn is triggered by a put request "PurchasingUpdate" from purchasing service.
 * It checks for the Recruit matching the arg passed into the Fn.
 * Once found the method will look through all the products to find
 * if any are still awaiting a purchase update. If all stocked booleans
 * are true then the Recruit is forwarded to the Invoicing service.
 * @argument {JSON} RecruitInbound This is the Recruit to be used to query the db.
 */
function isRecruitReadyForInvoicingService(RecruitInbound) {
    var RecruitProducts = RecruitInbound.products;
    var counter = 0;
    var messAge = "";
    RecruitProducts.forEach(function (element) {
        //This compares the stock vs the Recruit requirement and sets
        //boolean available if the products are in stock. 
        if (!element.nowAvailable) {
            counter++;
        }
    }, this);

    if (counter == 0) {
        console.log('Recruit Complete forward to invoicing');
        RecruitInbound.RecruitStatus = "Pending Invoice";
        RecruitInbound.stocked = true;
        sendRecruitToInvoicing(RecruitInbound);

    } else {

        if (counter > 1) {
            messAge = " More products are";
        } else {
            messAge = " More product is";
        }

        console.log(counter + messAge + ' awaiting Restock update');
        RecruitInbound.RecruitStatus = "Waiting for Stock";
        RecruitInbound.stocked = false;
    }
    RecruitInbound.save();
}

/**
 * @description 
 * This post recieves and update for a products availablity. It queries the document for 
 * sub-documents with a matching EAN. If fount this sub doc value nowAvailable is set to true.
 * @param {JSON} reqData is the request make by the purchasing service
 * @function isRecruitReadyForInvoicingService(Recruit); 
 * This function is envoked if the correct ean and RecruitRef numbers match. 
 * @see isRecruitReadyForInvoicingService(Recruit); for more details
 */
function purchasingServUpdateHandler(reqData) {
    return new Promise(function (resolve, reject) {
        var count = 0;
        Recruit.findOne({ RecruitRef: reqData.body.RecruitRef }).then(function (Recruit) {
            if (Recruit != null) {
                Recruit.products.forEach(function (element) {
                    if (element.ean == reqData.body.ean && count == 0) {
                        if (element.nowAvailable) {
                            count++;
                            resolve('Product Already Updated');

                        } else {
                            element.nowAvailable = true;
                            Recruit.save();
                            count++;
                            isRecruitReadyForInvoicingService(Recruit);
                            resolve('Update Successful');
                        }
                    }
                }, this);

            } else {
                console.log('Invalid RecruitRef: Provided ');
                resolve('Invalid RecruitRef: Provided ');
                count++;
            }

            if (count < 1) {
                console.log('No Matching EAN: found for this Recruit');
                resolve('No Matching EAN: found for this Recruit');
            }
        })
    })
}

module.exports = {
    isRecruitUnique,
    isRecruitReadyForInvoicingService,
    purchasingServUpdateHandler
};
