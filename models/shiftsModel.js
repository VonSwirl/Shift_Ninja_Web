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
    shiftPay: { type: Float32Array }
});

shiftsSchema.plugin(dataTables);

var Shifts = mongoose.model('shiftsModel', shiftsSchema);

//This exports the model.
module.exports = Shifts;