import React from 'react';
import ERRORIMAGE from '../../assets/404.png';
import { Link } from 'react-router-dom';

export default function UnAuthorized() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <img src={ERRORIMAGE} alt="404" className="w-96 h-auto mb-6" />
      <Link
        to="/"
        className="px-6 py-3 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 transition duration-300"
      >
        Back to Login
      </Link>
    </div>
  );
}