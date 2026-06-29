import React from 'react';

function Home() {
  return (
    <div style={{background: '#0B1629', color: '#fff', minHeight: '100vh', padding: '40px'}}>
      <h1>🎉 Arif Hissab - አሪፍ ሂሳብ</h1>
      <p>Business Accounting App for Ethiopia</p>
      <button onClick={() => window.location.href = '/auth'} style={{background: '#3B6EF0', color: '#fff', padding: '10px 20px', border: 'none', borderRadius: '8px', cursor: 'pointer'}}>
        Sign Up
      </button>
    </div>
  );
}

export default Home;