import React, { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from './firebase-config';

function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(false);

  const handleRegister = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert('Registration successful!');
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert('Login successful!');
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    window.location.reload();
  };

  return (
    <div style={{background: '#0B1629', color: '#fff', minHeight: '100vh', padding: '40px', textAlign: 'center'}}>
      <h2>{isLogin ? 'Login' : 'Register'}</h2>
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={{padding: '10px', margin: '10px', width: '200px'}} />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} style={{padding: '10px', margin: '10px', width: '200px'}} />
      <br />
      <button onClick={isLogin ? handleLogin : handleRegister} style={{background: '#3B6EF0', color: '#fff', padding: '10px 20px', margin: '10px', border: 'none', borderRadius: '8px', cursor: 'pointer'}}>
        {isLogin ? 'Login' : 'Register'}
      </button>
      <button onClick={() => setIsLogin(!isLogin)} style={{background: '#00E096', color: '#000', padding: '10px 20px', margin: '10px', border: 'none', borderRadius: '8px', cursor: 'pointer'}}>
        {isLogin ? 'Go to Register' : 'Go to Login'}
      </button>
      <button onClick={handleLogout} style={{background: '#DA121A', color: '#fff', padding: '10px 20px', margin: '10px', border: 'none', borderRadius: '8px', cursor: 'pointer'}}>
        Logout
      </button>
    </div>
  );
}

export default Auth;