const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { ApolloServer } = require('@apollo/server');
const { ApolloGateway, RemoteGraphQLDataSource } = require('@apollo/gateway');
const { expressMiddleware } = require('@as-integrations/express4');

async function startGateway() {
  const app = express();

  const gateway = new ApolloGateway({
    serviceList: [
      { name: 'auth', url: 'http://localhost:3003/graphql' },
      { name: 'communityEngagement', url: 'http://localhost:3004/graphql' },
    ],
    buildService({ name, url }) {
      return new RemoteGraphQLDataSource({
        url,
        willSendRequest({ request, context }) {
          // Forward only the 'token' cookie from client to subgraph
          const tokenCookie = context.req?.cookies?.token;
          if (tokenCookie) {
            request.http.headers.set('cookie', `token=${tokenCookie}`);
          }
        },
        didReceiveResponse({ response, context }) {
          // Forward Set-Cookie headers from subgraph to client
          const setCookieHeaders = response.http.headers.get('set-cookie');
          if (setCookieHeaders && context.res) {
            context.res.set('set-cookie', setCookieHeaders);
          }
          return response;
        },
      });
    },
  });

  const server = new ApolloServer({
    gateway,
  });

  await server.start();

  app.use(cookieParser());
  app.use(
    '/graphql',
    cors(),
    express.json(),
    expressMiddleware(server, {
      context: ({ req, res }) => ({ req, res }),
    })
  );

  app.listen(4000, () => {
    console.log('Gateway ready at http://localhost:4000/graphql');
  });
}

startGateway();