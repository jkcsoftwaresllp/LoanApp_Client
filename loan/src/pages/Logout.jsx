import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { clearTokens } from "../utils/tokenUtils"; // Utility function to clear tokens
import { useAuthContext } from "../context/AuthContext";

const Logout = () => {
  const navigate = useNavigate();
  const { setIsAuthenticated } = useAuthContext(); // Update authentication state

  useEffect(() => {
    // Clear tokens and update state
    clearTokens();
    setIsAuthenticated(false);

    // Redirect to login after clearing tokens
    navigate("/login");
  }, [navigate, setIsAuthenticated]);

  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-lg font-bold">Logging out...</p>
    </div>
  );
};

export default Logout;
