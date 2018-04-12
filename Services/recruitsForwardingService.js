
var config = require('../config');
var req = require('request');

/**
 * @description This function sends a post request to the purchasing service with all the 
 * missing items from the order that need to be stock to satify the order before it can be forwared
 * to invoicing service
 * @param {JSON} missingOrder This data is a nested map of products that require ordering 
 */
function sendOrderToPurchasingService(missingOrder) {
    console.log(missingOrder);
    try {
        req.post({
            url: config.purchaseMissingStockURL,
            body: missingOrder,
            json: true

        }, function (err, res, body) {
            if (err) {
                console.log('There was an error', err);
            }
        })
    } catch (err) {
        console.log('error connecting to purchasing service', err);
    }
}

/**
 * @description This issues a post request to the invoicing service with a valid order.
 * @param {JSON} order This sends a nicely validated order to invoicing service 
 */
function sendOrderToInvoicing(order) {
    console.log(order);
    try {
        req.post({
            url: config.sendOrderToInvoicingURL,
            body: order.json,
            json: true

        }, function (err, res, body) {
            if (err) {
                console.log('There was an error', err);
                //console.log(res);
            }
        })
    } catch (err) {
        console.log('error with letting order service know we have update', err);
    }
}

/**
 * @param {*} cID 
 * @param {*} approved 
 */
function customerAuthUpdate(cID, approved) {
    return new Promise(function (resolve, reject) {
        Order.find({ custoRef: cID }).then(function (orderOrListOf) {
            var count = 0;

            orderOrListOf.forEach(function (element) {
                count++;
                element.custoAuth = approved;

            }, this);

            if (count > 0) {
                resolve('Customer Approval Updated. ' + count + ' Orders forwarded to Invoicing Service');
            } else {
                reject('No Customer orders found matching the Id provided');
            }

        }).catch(function (err) {
            reject('error occured. check customerId or Params. customer authorisation not updated');
        });
    })
}

module.exports = {
    sendOrderToPurchasingService,
    customerAuthUpdate,
    sendOrderToInvoicing
};