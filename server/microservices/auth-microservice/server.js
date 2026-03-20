const mongoose = require('mongoose');
const resolvers = require('./resolvers');
const typeDefs = require('./typeDefs');
const { ApolloServer, gql } = require('@apollo/server');
const { buildSubgraphSchema } = require('@apollo/subgraph');
const {expressMiddleware} = require('@as-integrations/express4')
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');


const MONGODB_URL = "mongodb://localhost:27017/authDB";


const configureMongoose = async () => {
  try {
    await mongoose.connect(MONGODB_URL);
    console.log(`Connected to MongoDB at ${MONGODB_URL}`);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};



const startServer = async () => {
    await configureMongoose();


    const server = new ApolloServer({
        schema: buildSubgraphSchema([{ typeDefs, resolvers }]),
    });

    await server.start();

    const app = express();
    const port = 3003;
    app.use(cookieParser());
    app.use(
        '/graphql',
        cors(),
        express.json(),
        expressMiddleware(server, {
            context: async ({req, res}) => {
                return {req, res}
            }
        })
    );

    app.listen(process.env.PORT || port, async () => {
    console.log(`Authentication microservice ready at http://localhost:${port}${server.graphqlPath}`)
    });

}


startServer();


