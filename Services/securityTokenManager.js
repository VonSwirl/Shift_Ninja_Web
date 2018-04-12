const jsonWToken = require('jsonwebtoken');

/**
 * @description This function retrieves the Json Web Token string from the request
 * @param {JSON} req This is the request from the url
 */
function retreiveTokenFromUrl(req) {
    var JsonToken = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'];
    if (JsonToken) {
        try {
            return jsonWToken.decode(JsonToken, config.secret);

        } catch (err) {
            return ("There was an error during fn retreiveTokenFromUrl(req) message = " + err);

        }
    } else {
        return null;
    }
}

/**
 * @description This funtion confirms if the user is able to make 
 * purchases based on the data from the web token
 * @param {JSON} req Represents the url request
 */
function isCustomerAuthToPurchase(req) {
    console.log('Validating User Purchase Authorisation');
    var decodedToken = retreiveTokenFromUrl(req);

    if (decodedToken) {
        if (decodedToken.canPurchase) {
            return true;

        }
    }
    return false;

}

module.exports = { isCustomerAuthToPurchase, retreiveTokenFromUrl };
