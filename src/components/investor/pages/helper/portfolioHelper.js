import axios from "axios";
import { API_BASE_URL } from "../../../../config";

export const fetchPortfolioData = async () => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      throw new Error("No token found");
    }

    const response = await axios.get(`${API_BASE_URL}auth/portfolio`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data.uniqueCode === "PT24") {
      return { success: true, data: response.data.data };
    }
    return { success: false, error: "Unexpected response format" };
  } catch (error) {
    return { success: false, error: error.response || error };
  }
};

export const fetchMonthlyRoi = async (year, month) => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      throw new Error("No token found");
    }

    const response = await axios.get(`${API_BASE_URL}auth/monthly-roi`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        year,
        month
      }
    });

    console.log("Monthly ROI response:", response.data);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response || error };
  }
};
