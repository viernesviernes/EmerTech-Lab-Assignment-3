const mongoose = require('mongoose');

const aiResponseSchema = new mongoose.Schema(
    {
        text: { type: String, required: true },
        suggestedQuestions: { type: [String], default: [] },
        retrievedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'CommunityPost' }],
    },
    { _id: false }
);

module.exports = aiResponseSchema;
