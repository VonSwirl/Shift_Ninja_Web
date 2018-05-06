var development = 'mongodb://snwsu:snwsu1@ds014578.mlab.com:14578/shift-ninja-db'
//  'secret':'jwtsecret' 

var test = 'mongodb://snwsu:snwsu1@ds014578.mlab.com:14578/shift-ninja-db'
// 'secret':'jwtsecret'

var deploy = 'mongodb://snwsu:snwsu1@ds014578.mlab.com:14578/shift-ninja-db'
//'secret':'jwtsecret'

var localDB = 'mongodb://localhost/recruits';

function configURL(enviroment) {
    switch (enviroment) {
        case
            'development':
            return development;
        case
            'test':
            return test;
        case
            'deploy':
            return deploy;
        case
            'local':
            return localDB;
        default:
            return development;
    }
}

module.exports = { configURL};

