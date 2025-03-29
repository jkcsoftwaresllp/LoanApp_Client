import { API_BASE_URL } from "../../../../config";
export const fetchDashboardData = async () => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    const response = await fetch(`${API_BASE_URL}auth/admin-dashboard`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const data = await response.json();
    console.log("Dashboard API Response:", data);

    // Format the monthlyApprovedLoans data for the graph
    const formattedMonthlyApprovedLoans = data.data.monthlyApprovedLoans.map(
      (item) => ({
        month: item.month,
        approvals: item.count,
      })
    );

    return {
      ...data,
      formattedMonthlyApprovedLoans,
    };
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    throw error;
  }
};
