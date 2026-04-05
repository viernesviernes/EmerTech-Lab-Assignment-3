const Interaction = require('../models/interaction');

async function saveInteraction(userId, userMsg, aiResponse) {
    const interaction = new Interaction({
        userId,
        userMsg,
        aiResponse: {
            text: aiResponse.text,
            suggestedQuestions: aiResponse.suggestedQuestions ?? [],
            retrievedPosts: aiResponse.retrievedPosts ?? [],
        },
    });
    return interaction.save();
}

async function getAllUserInteractions(userId) {
    return Interaction.find({ userId }).populate('aiResponse.retrievedPosts').sort({ updatedAt: -1 }).exec();
}

const interactionRecorderObject = {
    saveInteraction,
    getAllUserInteractions,
};

module.exports = interactionRecorderObject;
