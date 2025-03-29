const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { readFileSync } = require('fs');
const { join } = require('path');
const cors = require('cors');
const resolvers = require('./graphql/resolvers');

// Load schema
const typeDefs = readFileSync(
  join(__dirname, 'graphql', 'schema.graphql'),
  'utf8'
);

async function startServer() {
  // Create Express app
  const app = express();
  
  // Setup middleware
  app.use(cors());
  app.use(express.json());
  
  // Create Apollo Server
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({ req }),
    introspection: true, // Enable introspection in production for this example
    playground: true, // Enable playground in production for this example
  });
  
  await server.start();
  
  // Apply Apollo middleware to Express
  server.applyMiddleware({ app, path: '/graphql' });
  
  // Define port
  const PORT = process.env.PORT || 4000;
  
  // Start server
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}${server.graphqlPath}`);
  });
}

startServer().catch((err) => {
  console.error('Error starting server:', err);
});