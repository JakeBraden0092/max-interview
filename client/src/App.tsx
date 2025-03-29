import React from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import AppRoutes from './routes';
import AuthProvider from './contexts/AuthContext';
import CartProvider from './contexts/CartContext';
import './index.css';

// Set up Apollo Client
const httpLink = createHttpLink({
  uri: 'http://localhost:4000/graphql', // This would be your GCP API endpoint in production
});

// Add auth token to requests
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

const App: React.FC = () => {
  return (
    <ApolloProvider client={client}>
      <AuthProvider client={client}>
        <CartProvider>
          <AppRoutes />
        </CartProvider>
      </AuthProvider>
    </ApolloProvider>
  );
};

export default App;
