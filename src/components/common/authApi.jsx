
import axios from 'axios';


const apiRequest = async (method, url, payload, accessToken, setLoading) => {
  if (!accessToken) {
    throw new Error("You're not logged in.");
  }

  setLoading && setLoading(true);

  try {
    const response = await axios({
      method,
      url,
      data: payload,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.data.status !== "success") {
      throw new Error(response.data.message || "Request failed.");
    }

    return response.data;
  } catch (error) {
    console.error("API request error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Something went wrong. Please try again.");
  } finally {
    setLoading && setLoading(false);
  }
};

export default apiRequest;
