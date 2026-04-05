const {gql} = require('apollo-server-express');

const typeDefs = gql`
type communityPost {
    id: ID!,
    author: ID!,
    title: String!,
    content: String!,
    category: String!,
    aiSummary: String,
    createdAt: String!,
    updatedAt: String!,
    }

type helpRequest {
    id: ID!,
    author: ID!,
    description: String!,
    location: String,
    isResolved: Boolean!,
    volunteers: [ID!]!,
    createdAt: String!,
    updatedAt: String!,
}

type interaction {
    id: ID!,
    userId: ID!,
    userMsg: String!,
    aiResponse: aiResponse!,
    createdAt: String!,
    updatedAt: String!,
}

type aiResponse {
    text: String!,
    suggestedQuestions: [String!]!,
    retrievedPosts: [communityPost!]!,
}

type Query {
    getCommunityPosts: [communityPost!]!
    getHelpRequests: [helpRequest!]!
    getInteractions: [interaction!]!
}

type Mutation {
    createCommunityPost(
        title: String!,
        content: String!,
        category: String!,
    ): communityPost!

    createHelpRequest(
        description: String!,
        location: String,
    ): helpRequest!

    volunteerForHelpRequest(helpRequestId: ID!): helpRequest!
    updateHelpRequestIsResolved(helpRequestId: ID!, isResolved: Boolean!): helpRequest!
    sendMessageToAI(userMsg: String!): aiResponse!
}
`;

module.exports = typeDefs;