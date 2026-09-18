import React from 'react';
import './Loader.scss'; 

function Loader({ message = "Loading..." }) {
  return (
    <main className="loader-screen">
      <div className="spinner"></div>
      <h2 className="loader-text">{message}</h2>
    </main>
  );
}

export default Loader;