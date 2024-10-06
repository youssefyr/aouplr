import { LoadingPageProps } from '@/lib/types';
import React from 'react';


const LoadingPage: React.FC<LoadingPageProps> = ({ message = "Loading, please wait..." }) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-base-200 p-4">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="loading loading-infinity loading-lg h-16 border-t-4 border-b-4 border-primary"></div>
        </div>
        <h1 className="text-2xl font-bold mb-2">{message}</h1>
        <p className="text-sm text-gray-500">We are fetching the data for you. This might take a few seconds.</p>
      </div>
    </div>
  );
};

export default LoadingPage;