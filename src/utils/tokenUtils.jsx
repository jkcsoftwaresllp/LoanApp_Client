
export const saveTokens = (accessToken, refreshToken, loanData = null) => {
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken", refreshToken);

  if (loanData) {
    localStorage.setItem("loanData", JSON.stringify(loanData));
  } else {
    localStorage.removeItem("loanData"); // Clear loanData if not provided
  }
};

export const getAccessToken = () => localStorage.getItem("accessToken");
export const getRefreshToken = () => localStorage.getItem("refreshToken");

export const clearTokens = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("loanData");
};

