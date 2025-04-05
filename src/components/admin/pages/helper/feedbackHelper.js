import axios from "axios";
import { API_BASE_URL } from "../../../../config";

export const fetchUserFeedback = async () => {
  try {
    const token = localStorage.getItem("accessToken");
    const response = await axios.get(
      `${API_BASE_URL}auth/user-feedback-admin`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("User Feedback API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching user feedback:", error.response || error);
    throw error;
  }
};
