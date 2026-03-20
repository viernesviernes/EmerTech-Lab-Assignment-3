import { lazy, Suspense, useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { gql, useQuery } from '@apollo/client';

const AuthApp = lazy(() => import('authApp/App'));
const CommunityApp = lazy(() => import('communityApp/App'));

const CURRENT_USER_QUERY = gql`
  query CurrentUser {
    currentUser {
      username
    }
  }
`;

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const { loading, error, data } = useQuery(CURRENT_USER_QUERY, {
    fetchPolicy: 'network-only',
  });

  useEffect(() => {
    const handleLoginSuccess = (event) => {
      setIsLoggedIn(event.detail.isLoggedIn);
    };

    window.addEventListener('loginSuccess', handleLoginSuccess);

    if (!loading && !error) {
      setIsLoggedIn(!!data.currentUser);
    }

    return () => {
      window.removeEventListener('loginSuccess', handleLoginSuccess);
    };
  }, [loading, error, data]);

  if (loading) return <div>Loading...</div>;

  return (
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Redirect isLoggedIn={isLoggedIn} />} />
          <Route path="/login" element={<AuthApp />} />
          <Route path="/community" element={<CommunityApp />} />
        </Routes>
      </Suspense>
  );
}

// Redirect component
const Redirect = ({ isLoggedIn }) => {
  if (!isLoggedIn) {
    window.location.href = '/login';
  } else {
    window.location.href = '/community';
  }
  return null;
}

export default App;