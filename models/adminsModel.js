const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const dataTables = require('mongoose-datatables');

//Create Administrator domain model and schema
const adminsSchema = new Schema({
    adminID: { type: String },
    adminUsername: { type: String },
    adminFName: { type: String },
    adminSName: { type: String },
    adminPassword: { type: String },
});

// Allows Datatables to read Admin data correctly
adminsSchema.plugin(dataTables);

//Create the Mongoose model with adminsSchema
var Admins = mongoose.model('adminsModel', adminsSchema);

//This exports the model.
module.exports = Admins;