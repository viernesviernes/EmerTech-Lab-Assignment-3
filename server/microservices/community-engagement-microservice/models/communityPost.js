const mongoose = require('mongoose');


const CommunityPostSchema = new mongoose.Schema({
    author: {type: mongoose.Schema.Types.ObjectId, ref: 'User', require: true},
    title: {type: String, require: true},
    content: {type: String, require: true},
    category: {type: String, enum: ['news', 'discussion'], require: true},
    aiSummary: {type: String},
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now},
});

const CommunityPost = mongoose.model('CommunityPost', CommunityPostSchema);
module.exports = CommunityPost;