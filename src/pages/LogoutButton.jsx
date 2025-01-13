// components/LogoutButton.js

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { clearTokens } from '../utils/tokenUtils'; 
import { useAuthContext } from '../context/AuthContext'; 

const LogoutButton = () => {
  const navigate = useNavigate();
  const { setIsAuthenticated } = useAuthContext();

  const handleLogout = () => {
    clearTokens(); 
    setIsAuthenticated(false); 
    navigate('/login'); 
  };

  return (
    <button
      onClick={handleLogout}
      className="mt-4 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 focus:outline-none"
    >
      Logout
    </button>
  );
};

export default LogoutButton;
