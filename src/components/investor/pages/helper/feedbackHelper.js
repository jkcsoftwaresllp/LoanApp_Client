import axios from "axios";
import { API_BASE_URL } from "../../../../config";

export const submitFeedback = async (feedbackData) => {
  try {
    const role = localStorage.getItem("role");
    let endpoint = "user-feedback"; // Default endpoint
    
    if (role === "investor") {
      endpoint = "investor-feedback";
    } else if (role === "admin") {
      endpoint = "user-feedback-admin";
    }

    const response = await fetch(`${API_BASE_URL}auth/${endpoint}`, {
      method: role === "admin" ? "GET" : "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      body: role === "admin" ? null : JSON.stringify(feedbackData),
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
