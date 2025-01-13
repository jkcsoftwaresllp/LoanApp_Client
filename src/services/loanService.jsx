import axios from "axios";

const API_URL = "http://localhost:5000"; // Change this to your backend server's URL

const loanService = {
  saveDraft: async (data) => {
    try {
      const response = await axios.post(`${API_URL}/api/save-draft`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Failed to save draft:", error);
      throw error;
    }
  },

  submitLoan: async (loan_id) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/submit`,
        { loan_id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Failed to submit loan:", error);
      throw error;
    }
  },
};

export default loanService;
