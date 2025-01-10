import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api", 
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (
      error.response?.status === 401 &&
      error.response?.data.error === "Token expired. Please refresh the token."
    ) {
      const refreshToken = localStorage.getItem("refreshToken");

      if (refreshToken) {
        try {
          const { data } = await axios.post(
            `${process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api"}/refresh-token`,
            { refreshToken }
          );

          
          localStorage.setItem("accessToken", data.accessToken);

          // Retry the original request with the new access token
          error.config.headers["Authorization"] = `Bearer ${data.accessToken}`;
          return axios(error.config);
        } catch (refreshError) {
          console.error("Error refreshing token:", refreshError);
          
          window.location.href = "/login";
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;
