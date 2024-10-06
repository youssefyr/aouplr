// src/app/_offline.tsx
import React from 'react';

const OfflinePage: React.FC = () => (
  <div className="flex items-center justify-center min-h-screen bg-base-200 p-4">
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-4">You are offline</h1>
      <p className="mb-4">It seems you are not connected to the internet. Please check your connection and try again.</p>
      <div className="flex justify-center">
        <button className="btn btn-primary" onClick={() => window.location.reload()}>Retry</button>
      </div>
    </div>
  </div>
);

export default OfflinePage;