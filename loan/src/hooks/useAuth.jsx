import { useEffect, useState } from "react";
import axiosInstance from "../utils/apiClient";
import { getRefreshToken, saveTokens, clearTokens } from "../utils/tokenUtils";

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // Track the loading state

  useEffect(() => {
    const refreshToken = getRefreshToken();

    if (refreshToken) {
      axiosInstance
        .post("/api/auth/refresh-token", { refreshToken })
        .then((response) => {
          saveTokens(response.data.accessToken, response.data.refreshToken);
          setIsAuthenticated(true);
        })
        .catch(() => {
          clearTokens();
          setIsAuthenticated(false);
        })
        .finally(() => {
          setLoading(false); // Loading complete
        });
    } else {
      clearTokens();
      setIsAuthenticated(false);
      setLoading(false); // No refresh token means no authentication
    }
  }, []);

  return { isAuthenticated, loading };
};

export default useAuth;
