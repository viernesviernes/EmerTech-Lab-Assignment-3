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

type Query {
    getCommunityPosts: [communityPost!]!
    getHelpRequests: [helpRequest!]!
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
}
`;

module.exports = typeDefs;