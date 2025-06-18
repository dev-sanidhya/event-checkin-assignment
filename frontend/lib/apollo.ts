import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { useAuthStore } from '../store/authStore';

const httpLink = createHttpLink({
  uri: 'http://localhost:4000/graphql', // Update this to your backend URL
});

const authLink = setContext((_, { headers }) => {
  const token = useAuthStore.getState().token;
  
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
});

export const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

