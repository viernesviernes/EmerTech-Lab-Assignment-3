const mongoose = require('mongoose');


const helpRequestSchema = new mongoose.Schema({
    author: {type: mongoose.Schema.Types.ObjectId, ref: 'User', require: true},
    description: {type: String, require: true},
    location: {type: String},
    isResolved: {type: Boolean, default: false},
    volunteers: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now},
});

const HelpRequest = mongoose.model('HelpRequest', helpRequestSchema);
module.exports = HelpRequest;