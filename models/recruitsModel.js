const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const dataTables = require('mongoose-datatables');
//Creates a separate schema that allows the shift events to be stored as an array of object
const shiftEventsSchema = new Schema({
    shiftID: { type: Number },
    shiftCompanyName: { type: String },
    shiftAddress: { type: String },
    shiftRole: { type: String },
    shiftStart: { type: Date },
    shiftEnd: { type: Date },
    shiftRateCode: { type: Number },
    shiftPay: { type: Number }
});

//Creates a separate schema that allows the qualifications to be stored as an array of object
const qualificationsSchema = new Schema({
    qualID: { type: Number },
    qualTitle: { type: String },
    qualObject: { data: Buffer, contentType: String },
    qualDateAdded: { type: Date }
});

//Create Recruits domain model and schema
const recruitsSchema = new Schema({
    recID: { type: Number },
    recRecruitRef: { type: String },
    recTitle: { type: String },
    recFirstN: { type: String },
    recSurN: { type: String },
    recForeN: { type: String },
    recAddress: {type: String},
    recMobile:{type: Number},
    allQuals: [qualificationsSchema],
    recActive: { type: Boolean, default: false },
    recExperience: { type: String },
    recProfilePic: {  data: Buffer, contentType: String },
    allShifts: [shiftEventsSchema]
});

recruitsSchema.plugin(dataTables);

var Recruit = mongoose.model('recruitsModel', recruitsSchema);

//This exports the model.
module.exports = Recruit;


