import React from 'react';
import { Navigate } from 'react-router-dom';

const UnAuthorized = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen text-center">
        <h1 className="text-5xl font-bold mb-4">404 - Page Not Found</h1>
        <p className="text-lg mb-6">Oops! The page you are looking for does not exist.</p>
        <Navigate to='/login' replace className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-600 transition">Go Back Home</Navigate> 
    </div>
    );
};

export default UnAuthorized;