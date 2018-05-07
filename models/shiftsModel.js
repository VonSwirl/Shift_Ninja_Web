const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//Allows datatables to read mongoose schema
const dataTables = require('mongoose-datatables');

//Create Shifts domain model and schema
const shiftsSchema = new Schema({
    shiftID: { type: Number },
    recID: { type: Number },
    shiftCompanyName: { type: String },
    shiftAddress: { type: String },
    shiftRole: { type: String },
    shiftStart: { type: Date },
    shiftEnd: { type: Date },
    shiftRateCode: { type: Number },
    shiftPay: { type: Number }
});

// Allows Datatables to read Shifts data correctly
shiftsSchema.plugin(dataTables);

// Create the Mongoose model with shiftsSchema
var Shifts = mongoose.model('shiftsModel', shiftsSchema);

//This exports the model.
module.exports = Shifts;