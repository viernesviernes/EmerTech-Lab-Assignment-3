const {gql} = require('apollo-server-express');


const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    email: String!
    role: String!
  }

  type Query {
    currentUser: User
  }

  type Mutation {
    register(
      username: String!
      email: String!
      role: String!
      password: String!
    ): User

    loginByUsername(username: String!, password: String!): User
    loginByEmail(email: String!, password: String!): User
    signOut: Boolean
  }
`;

module.exports = typeDefs;