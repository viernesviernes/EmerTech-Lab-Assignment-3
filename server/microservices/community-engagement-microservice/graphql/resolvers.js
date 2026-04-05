const CommunityPost = require('../models/communityPost');
const HelpRequest = require('../models/helpRequest');
const { getUserIdFromToken, generateAiSummary } = require('../helpers');

// For sendMessagetoAI
const retrieveRelevantCommunityPosts = require('../ai-pipeline/retrieveRelevantCommunityPosts');
const { getAllUserInteractions, saveInteraction } = require('../services/interactionRecorderService');
const GenerateGemeniApiResponse = require('../services/gemeniApiService');

const resolvers = {
    Query:{
        getCommunityPosts: async(_, __, context) => {
            return await CommunityPost.find().sort({updatedAt: -1});
        },
        getHelpRequests: async(_, __, context) => {
            return await HelpRequest.find().sort({updatedAt: -1});
        },
        getInteractions: async(_, __, context) => {
            const userId = getUserIdFromToken(context);
            const interactions = await getAllUserInteractions(userId);
            return interactions.map(interaction => {
                const obj = interaction.toObject();
                return {
                    ...obj,
                    id: obj._id.toString(),
                    aiResponse: {
                        text: obj.aiResponse?.text ?? '',
                        suggestedQuestions: obj.aiResponse?.suggestedQuestions ?? [],
                        retrievedPosts: (obj.aiResponse?.retrievedPosts ?? []).map(p =>
                            p && typeof p === 'object' && p._id
                                ? { ...p, id: p._id.toString() }
                                : { id: p?.toString() ?? '', title: '', content: '', author: '', category: '', createdAt: '', updatedAt: '' }
                        )
                    }
                };
            });
        }
    },
    Mutation: {
        createCommunityPost: async(_, {title, content, category}, context) => {
            const authorId =  getUserIdFromToken(context);

            const aiSummary = await generateAiSummary(content);

            const communityPost = new CommunityPost({title, content, category, author: authorId, aiSummary});
            return await communityPost.save();
        },
        createHelpRequest: async(_, {description, location}, context) => {
            const authorId = getUserIdFromToken(context);
            const helpRequest = new HelpRequest({description, location, author:authorId});
            return await helpRequest.save();
        },
        volunteerForHelpRequest: async(_, {helpRequestId}, context) => {
            const userId = getUserIdFromToken(context);
            const helpRequest = await HelpRequest.findById(helpRequestId);
            if (!helpRequest) {
                throw new Error('Help request not found');
            }
            if (helpRequest.author.toString() === userId) {
                throw new Error('Author cannot volunteer for their own help request');
            }
            if (helpRequest.volunteers.includes(userId)) {
                throw new Error('User has already volunteered for this help request');
            }
            if (helpRequest.isResolved) {
                throw new Error('Cannot volunteer for a resolved help request');
            }
            helpRequest.volunteers.push(userId);
            return await helpRequest.save();
        },
        updateHelpRequestIsResolved: async(_, {helpRequestId, isResolved}, context) => {
            const userId = getUserIdFromToken(context);
            const helpRequest = await HelpRequest.findById(helpRequestId);
            if (!helpRequest) {
                throw new Error('Help request not found');
            }
            if (helpRequest.author.toString() !== userId) {
                throw new Error('Only the author can update the help request');
            }
            helpRequest.isResolved = isResolved;
            return await helpRequest.save();
        },
        sendMessageToAI: async(_, {userMsg}, context) => {
            const userID = getUserIdFromToken(context);
            const allPosts = await retrieveRelevantCommunityPosts(userMsg);
            const pastInteractions = await getAllUserInteractions(userID);
            const aiResponse = await GenerateGemeniApiResponse(allPosts, pastInteractions, userMsg);
            await saveInteraction(userID, userMsg, aiResponse);
            return aiResponse;
        }
    },


};


module.exports = resolvers;