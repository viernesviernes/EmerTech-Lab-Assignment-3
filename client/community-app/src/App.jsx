import { ApolloClient, InMemoryCache, HttpLink, ApolloProvider } from '@apollo/client';
import './App.css'
import CommunityComponent from './CommunityComponent';

const client = new ApolloClient({
  link: new HttpLink({
    uri: 'http://localhost:4000/graphql',
    credentials: 'include'
  }),
  cache: new InMemoryCache()
});

function App() {
  return (
    <ApolloProvider client={client}>
      <div className='app-container'>
        <CommunityComponent />
      </div>
    </ApolloProvider>
  )
}

export default App
