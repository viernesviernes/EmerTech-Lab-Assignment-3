import { useEffect } from 'react'
import { ApolloClient, InMemoryCache, HttpLink, ApolloProvider } from '@apollo/client';
import './App.css'

import AuthComponent from './AuthComponent';

const client = new ApolloClient({
  link: new HttpLink({
    uri: import.meta.env.VITE_APP_GRAPHQL_URI,
    credentials: 'include'
  }),
  cache: new InMemoryCache()
});

function App() {
  useEffect(() => {
    console.log(import.meta.env.VITE_APP_NAME);
  }, []);

  return (
    <ApolloProvider client={client}>
       <AuthComponent />
    </ApolloProvider>
  )
}

export default App
