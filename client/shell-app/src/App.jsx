import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { gql, useQuery } from '@apollo/client';
const AuthApp = lazy(() => import('authApp/App'));

const CURRENT_USER_QUERY = gql`
  query CurrentUser {
    currentUser {
      username
    }
  }
`;

function App() {
  return (
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<RedirectToLogin />} />
          <Route path="/login" element={<AuthApp />} />
          <Route path="/dashboard" element={<div>Dashboard</div>} />
        </Routes>
      </Suspense>
  );
}

// Automatically redirect to login if not authenticated/unidentified user
const RedirectToLogin = () => {
  const { data, loading, error } = useQuery(CURRENT_USER_QUERY);

  if (loading) return <div>Loading...</div>;
  if (error || !data.currentUser) {
    window.location.href = '/login';
    return null;
  }
}

export default App;