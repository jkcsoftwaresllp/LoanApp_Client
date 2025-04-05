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

  const data = await response.json();
  console.log('Approved Loans API Response:', {
    endpoint: `${API_BASE_URL}auth/approvedLoans`,
    response: data
  });
  return data;
};

export const updateLoanStatus = async (accessToken, loanId, status) => {
  const payload = {
    loan_id: loanId.toString(),
    status: status,
  };
  console.log('Update Loan Status API Request:', {
    endpoint: `${API_BASE_URL}auth/admin-update-status`,
    payload
  });

  const response = await fetch(`${API_BASE_URL}auth/admin-update-status`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
  });

  const result = await response.json();
  console.log('Update Loan Status API Response:', {
    endpoint: `${API_BASE_URL}auth/admin-update-status`,
    response: result
  });

  if (!response.ok) {
    if (result.uniqueCode === "INV35" || result.uniqueCode === "INV36") {
      alert(result.message);
    }
    throw new Error(result.message || `HTTP error! status: ${response.status}`);
  }

  return result;
};

export const addInvestors = async (accessToken, loanId, investors) => {
  const payload = {
    loan_id: loanId.toString(),
    investors: Array.isArray(investors) ? investors : [investors]
  };

  console.log('Add Investors API Request:', {
    endpoint: `${API_BASE_URL}auth/addinvestor`,
    payload
  });

  const response = await fetch(`${API_BASE_URL}auth/addinvestor`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
  });

  const result = await response.json();
  console.log('Add Investors API Response:', {
    endpoint: `${API_BASE_URL}auth/addinvestor`,
    response: result
  });

  if (!response.ok) {
    throw new Error(result.message || `HTTP error! status: ${response.status}`);
  }

  return result;
};

export const filterLoans = (loans, statusToExclude = "Pending") => {
  return Array.isArray(loans)
    ? loans.filter((loan) => loan.status !== statusToExclude)
    : [];
};
