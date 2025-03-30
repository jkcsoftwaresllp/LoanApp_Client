import { API_BASE_URL } from "../../../../config";

export const fetchApprovedLoans = async (accessToken) => {
  const response = await fetch(`${API_BASE_URL}auth/approvedLoans`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Unauthorized: Please login again");
    }
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
};

export const updateLoanStatus = async (accessToken, loanId, status) => {
  const response = await fetch(`${API_BASE_URL}auth/admin-update-status`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      loan_id: loanId.toString(),
      status: status,
    }),
  });

  const result = await response.json();

  if (!response.ok) {
    if (result.uniqueCode === "INV35" || result.uniqueCode === "INV36") {
      alert(result.message);
    }
    throw new Error(result.message || `HTTP error! status: ${response.status}`);
  }

  return result;
};

export const filterLoans = (loans, statusToExclude = "Pending") => {
  return Array.isArray(loans)
    ? loans.filter((loan) => loan.status !== statusToExclude)
    : [];
};
