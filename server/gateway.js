const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { ApolloServer } = require('@apollo/server');
const { ApolloGateway, RemoteGraphQLDataSource } = require('@apollo/gateway');
const { expressMiddleware } = require('@as-integrations/express4');
const {
  getUserFromRequest,
  getCookieHeaderForSubgraph,
} = require('./gatewayAuth');

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
          // Auth subgraph: unchanged — same cookie shape as before (login / set-cookie flow).
          if (name === 'auth') {
            const tokenCookie = context.req?.cookies?.token;
            if (tokenCookie) {
              request.http.headers.set('cookie', `token=${tokenCookie}`);
            }
            return;
          }

          // Check authentication for protected subgraphs
          if (context.req && !context.user && !request.query?.includes('__schema') && !request.query?.includes('__type')) {
            throw new Error('Authentication required to access this service');
          }

          // Other subgraphs: forward session cookie using COOKIE_NAME (matches auth-microservice).
          const cookieHeader = getCookieHeaderForSubgraph(context.req);
          if (cookieHeader) {
            request.http.headers.set('cookie', cookieHeader);
          }

          if (context.user) {
            request.http.headers.set('x-user-id', String(context.user.id));
            if (context.user.role != null) {
              request.http.headers.set('x-user-role', String(context.user.role));
            }
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
    cors({origin: 'http://localhost:3000', credentials: true}),
    express.json(),
    expressMiddleware(server, {
      context: ({ req, res }) => ({
        req,
        res,
        user: getUserFromRequest(req),
      }),
    })
  );

  app.listen(4000, () => {
    console.log('Gateway ready at http://localhost:4000/graphql');
  });
}

startGateway();