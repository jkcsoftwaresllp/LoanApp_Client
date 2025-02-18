import axios from "axios";
import { showToast } from "../../utils/toastUtils";

const apiRequest = async (method, url, payload, accessToken, setLoading) => {
  if (!accessToken) {
    showToast("error", "You're not logged in.");
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
      showToast("error", "Request failed.");
      throw new Error(response.data.message || "Request failed.");
    }

    return response.data;
  } catch (error) {
    console.error("API request error:", error.response?.data || error.message);
    showToast("error", "Something went wrong. Please try again.");
    throw new Error(
      error.response?.data?.message || "Something went wrong. Please try again."
    );
  } finally {
    setLoading && setLoading(false);
  }
};

export default apiRequest;
