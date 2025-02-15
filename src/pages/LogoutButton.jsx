import React from "react";
import { useNavigate } from "react-router-dom";
import { clearTokens } from "../utils/tokenUtils";
import { useAuthContext } from "../context/AuthContext";
import { buttonConfig } from "../config/buttonConfig";
import { Button } from "../components/common/Button";
import { Logouticon } from "../components/common/assets";
import { showToast } from "../utils/toastUtils";
export const LogoutButton = () => {
  const navigate = useNavigate();
  const { setIsAuthenticated } = useAuthContext();

  const handleLogout = () => {
    clearTokens();
    setIsAuthenticated(false);
    navigate("/login");
    showToast("success", "Logout successful");
  };

  const logoutButtonConfig = buttonConfig({
    isLogout: true,
    handleLogout: handleLogout,
  })[0];

  return (
    <div
      type={logoutButtonConfig.type}
      text={logoutButtonConfig.text}
      onClick={logoutButtonConfig.onClick}
    >
      {Logouticon}
    </div>
  );
};
