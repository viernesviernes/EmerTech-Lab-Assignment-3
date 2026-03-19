const express = require('express');
const cors = require('cors');
const { ApolloServer } = require('@apollo/server');
const { ApolloGateway, IntrospectAndCompose } = require('@apollo/gateway');
const { expressMiddleware } = require('@as-integrations/express4');

async function startGateway() {
  const app = express();

  const gateway = new ApolloGateway({
    supergraphSdl: new IntrospectAndCompose({
      subgraphs: [
        { name: 'auth', url: 'http://localhost:3003/graphql' },
      ],
    }),
  });

  const server = new ApolloServer({
    gateway,
  });

  await server.start();

  app.use(
    '/graphql',
    cors(),
    express.json(),
    expressMiddleware(server)
  );

  app.listen(4000, () => {
    console.log('Gateway ready at http://localhost:4000/graphql');
  });
}

startGateway();