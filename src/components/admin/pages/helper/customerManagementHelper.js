import { API_BASE_URL } from "../../../../config";
import { showToast } from "../../../../utils/toastUtils";

export const fetchCustomers = async () => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    const response = await fetch(`${API_BASE_URL}auth/admin-getCustomers`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const { data } = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching customers:", error);
    showToast("Error fetching customers", "error");
    throw error;
  }
};

export const updateUserStatus = async (customer) => {
  try {
    const updatedStatus = customer.status === "active" ? "inactive" : "active";
    const accessToken = localStorage.getItem("accessToken");

    const response = await fetch(`${API_BASE_URL}auth/update-user-status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        user_id: customer.user_id,
        status: updatedStatus,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.message || `HTTP error! status: ${response.status}`
      );
    }

    showToast("success", `User status updated to ${updatedStatus}`);
    return true;
  } catch (error) {
    console.error("Error updating user status:", error.message);
    showToast("error", error.message || "Failed to update user status");
    throw error;
  }
};

export const deleteUser = async (customer) => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    const response = await fetch(`${API_BASE_URL}auth/deleteuser`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        user_id: customer.user_id,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.message || `HTTP error! status: ${response.status}`
      );
    }

    showToast("success", "User deleted successfully");
    return true;
  } catch (error) {
    console.error("Error deleting user:", error.message);
    showToast("error", error.message || "Failed to delete user");
    throw error;
  }
};
