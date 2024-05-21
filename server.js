const { ApolloServer, gql } = require("apollo-server-express");
const express = require("express");
const { createServer } = require("http");
const { SubscriptionServer } = require("subscriptions-transport-ws");
const { execute, subscribe } = require("graphql");
const { makeExecutableSchema } = require("@graphql-tools/schema");
const { PubSub } = require("graphql-subscriptions");

// Initialize PubSub
const pubsub = new PubSub();
const CHANNEL_UPDATED = "CHANNEL_UPDATED";

// Define your schema
const typeDefs = gql`
  type Query {
    channel(id: ID!): Channel
    channels: [Channel]
  }

  type Channel {
    id: ID!
    name: String
    description: String
  }

  type Subscription {
    channelUpdated: Channel
  }
`;

// Define your resolvers
const resolvers = {
  Query: {
    channels: () => [
      { id: 1, name: "Channel 1", description: "Description 1" },
      { id: 2, name: "Channel 2", description: "Description 2" },
      { id: 3, name: "Channel 3", description: "Description 3" },
      { id: 4, name: "Channel 4", description: "Description 4" },
      { id: 5, name: "Channel 5", description: "Description 5" },
    ],
  },
  Subscription: {
    channelUpdated: {
      subscribe: () => pubsub.asyncIterator([CHANNEL_UPDATED]),
    },
  },
};

// Create an executable schema
const schema = makeExecutableSchema({ typeDefs, resolvers });

// Initialize the Apollo server
const server = new ApolloServer({
  schema,
  mocks: true, // Enable mocking
  mockEntireSchema: false, // To use our custom subscription resolver
});

// Create an Express app and HTTP server
const app = express();
const httpServer = createServer(app);

// Apply Apollo server middleware to the Express app
server.start().then(() => {
  server.applyMiddleware({ app });

  // Set up WebSocket for handling subscriptions
  SubscriptionServer.create(
    { schema, execute, subscribe },
    { server: httpServer, path: server.graphqlPath }
  );

  // Start the HTTP server
  httpServer.listen({ port: 4000 }, () => {
    console.log(
      `🚀 Server ready at http://localhost:4000${server.graphqlPath}`
    );
    console.log(
      `🚀 Subscriptions ready at ws://localhost:4000${server.graphqlPath}`
    );
  });

  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function getRandomString(length) {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    const charactersLength = characters.length;

    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
  }

  // Example of publishing an event to the subscription
  setInterval(() => {
    const x = getRandomInt(1, 5);
    const y = getRandomString(5);
    pubsub.publish(CHANNEL_UPDATED, {
      channelUpdated: {
        id: x,
        name: `Updated Channel ${x}`,
        description: `Updated Description ${y}`,
      },
    });
  }, 1000); // Publish an update every 5 seconds
});
