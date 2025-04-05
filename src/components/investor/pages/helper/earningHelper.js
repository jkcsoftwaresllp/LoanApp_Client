import axios from "axios";
import { API_BASE_URL } from "../../../../config";
import apiRequest from "../../../../components/common/authApi";

export const fetchEarningsSchedule = async (setLoading) => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      throw new Error("No access token found");
    }

    const response = await apiRequest(
      "GET",
      `${API_BASE_URL}auth/schedule`,
      null,
      accessToken,
      setLoading
    );

    console.log("API Response:", response); // Added logging
    return response.data;
  } catch (error) {
    console.error("Error fetching earnings schedule:", error);
    throw error;
  }
};

export const processEarningsData = (earnings) => {
  // Check if earnings is empty or undefined
  if (!earnings || !earnings.schedule || earnings.schedule.length === 0) {
    return {
      chartData: [],
      donutChartData: [],
      totalPaid: 0,
      totalPending: 0,
      isEmpty: true  // Flag to indicate empty data
    };
  }

  // Process data if available
  const scheduleData = earnings.schedule;
  const chartData = scheduleData.map((e) => ({
    month: e.due_date.substring(0, 7),
    amount: parseFloat(e.amount),
  }));

  // Calculate Paid vs Pending
  const totalPaid = scheduleData
    .filter((e) => e.status === "Paid")
    .reduce((sum, e) => sum + parseFloat(e.amount), 0);

  const totalPending = scheduleData
    .filter((e) => e.status === "Pending")
    .reduce((sum, e) => sum + parseFloat(e.amount), 0);

  const donutChartData = [
    { name: "Paid", value: totalPaid },
    { name: "Pending", value: totalPending },
  ];

  return {
    chartData,
    donutChartData,
    totalPaid,
    totalPending,
    isEmpty: false
  };
};
