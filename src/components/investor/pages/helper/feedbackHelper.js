import axios from "axios";
import { API_BASE_URL } from "../../../../config";
export const submitFeedback = async (feedbackData) => {
  try {
    const role = localStorage.getItem("role");
    const endpoint = role === "investor" ? "investor-feedback" : "user-feedback";

    const response = await fetch(`${API_BASE_URL}auth/${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      body: JSON.stringify(feedbackData),
    });

    const result = await response.json();
    return { success: response.ok, data: result };
  } catch (error) {
    return {
      success: false,
      error: error.message || "Failed to submit feedback",
    };
  }
};
