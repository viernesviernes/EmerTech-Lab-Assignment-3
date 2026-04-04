const mongoose = require('mongoose');
const aiResponseSchema = require('./aiResponse');

const interactionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    userMsg: { type: String, required: true },
    aiResponse: { type: aiResponseSchema, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

const Interaction = mongoose.model('Interaction', interactionSchema);
module.exports = Interaction;
