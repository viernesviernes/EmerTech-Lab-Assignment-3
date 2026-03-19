const {gql} = require('apollo-server-express');


const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    email: String!
    role: String!
  }

  type Query {
    _empty: String
  }

  type Mutation {
    signUp(
      username: String!
      email: String!
      role: String!
      password: String!
    ): User

    signIn(username: String!, password: String!): Boolean
    signOut: Boolean
  }
`;

module.exports = typeDefs;