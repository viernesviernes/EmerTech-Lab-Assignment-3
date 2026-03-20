const CommunityPost = require('./models/communityPost');
const HelpRequest = require('./models/helpRequest');
require('dotenv').config();
const jwt = require('jsonwebtoken');

const {COOKIE_NAME, SESSION_SECRET: SECRET} = process.env;

function getUserIdFromToken(context) {
  const token = context.req.cookies[COOKIE_NAME];
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, SECRET);
    return decoded.id;
  } catch (err) {
    console.error('Error verifying token:', err);
    return null;
  }
}




const resolvers = {
    Query:{
        getCommunityPosts: async(_, __, context) => {
            return await CommunityPost.find().sort({updatedAt: -1});
        },
        getHelpRequests: async(_, __, context) => {
            return await HelpRequest.find().sort({updatedAt: -1});
        }
    },
    Mutation: {
        createCommunityPost: async(_, {title, content, category}, context) => {
            const authorId =  getUserIdFromToken(context);

            //TODO: Create logic for AI Summary, will neeed to call AI API.

            const communityPost = new CommunityPost({title, content, category, author: authorId});
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
        }
    },


};


module.exports = resolvers;