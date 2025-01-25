import { useEffect, useState } from "react";
import axiosInstance from "../utils/apiClient";
import { getRefreshToken, saveTokens, clearTokens } from "../utils/tokenUtils";

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const refreshToken = getRefreshToken();

    if (refreshToken) {
      axiosInstance
        .post("/api/auth/refresh-token", { refreshToken })
        .then((response) => {
          saveTokens(response.data.accessToken, response.data.refreshToken,response.data.loanData);
          setIsAuthenticated(true);
        })
        .catch(() => {
          clearTokens();
          setIsAuthenticated(false);
        })
        .finally(() => {
          setLoading(false); 
        });
    } else {
      clearTokens();
      setIsAuthenticated(false);
      setLoading(false); 
    }
  }, []);

  return { isAuthenticated, loading };
};

export default useAuth;