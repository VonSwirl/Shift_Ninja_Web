const LocalStrategy = require('passport-local').Strategy;
const Admin = require('../models/adminsModel');
const bcrypt = require('bcryptjs');

module.exports = function (passport) {
    // Local Strategy
    passport.use(new LocalStrategy(function (username, password, done) {
        console.log(username + ' ' + password);
        // Match Username
        Admin.findOne({ adminUsername: username }, function (err, admin) {
            if (err) throw err;
            if (!admin) {
                return done(null, false, { message: 'No Administrators found' });
            }
            // Match Password
            bcrypt.compare(password, admin.adminPassword, function (err, isMatch) {
                if (err) throw err;
                if (isMatch) {
                    return done(null, admin);
                } else {
                    if (isMatch) {
                        return done(null, false, { message: 'Wrong password' });
                    }
                }
            });
        });
    }));

    passport.serializeUser(function (admin, done) {
        done(null, admin.id);
    });

    passport.deserializeUser(function (id, done) {
        Admin.findById(id, function (err, admin) {
            done(err, admin);
        });
    });
}