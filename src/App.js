import React, { useState, useEffect } from 'react';
import { auth } from './firebase-config';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import Home from './Home';
import Auth from './Auth';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) {
    return <div style={{background: '#0B1629', color: '#fff', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>Loading...</div>;
  }

  return (
    <div style={{width: '100%', height: '100%', background: '#0B1629'}}>
      {!user ? <Home /> : <Auth />}
    </div>
  );
}

export default App;