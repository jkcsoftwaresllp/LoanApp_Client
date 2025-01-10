import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { clearTokens } from "../utils/tokenUtils"; 
import { useAuthContext } from "../context/AuthContext";

const Logout = () => {
  const navigate = useNavigate();
  const { setIsAuthenticated } = useAuthContext(); 

  useEffect(() => {
    
    clearTokens();
    setIsAuthenticated(false);

    
    navigate("/login");
  }, [navigate, setIsAuthenticated]);

  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-lg font-bold">Logging out...</p>
    </div>
  );
};

export default Logout;
