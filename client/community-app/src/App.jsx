import { ApolloClient, InMemoryCache, HttpLink, ApolloProvider } from '@apollo/client';
import './App.css'
import CommunityComponent from './CommunityComponent';

const client = new ApolloClient({
  link: new HttpLink({
    uri: import.meta.env.VITE_APP_GRAPHQL_URI,
    credentials: 'include'
  }),
  cache: new InMemoryCache()
});

function App() {
  return (
    <ApolloProvider client={client}>
      <CommunityComponent />
    </ApolloProvider>
  )
}

export default App
