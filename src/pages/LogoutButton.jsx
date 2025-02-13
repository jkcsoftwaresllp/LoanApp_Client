import React from "react";
import { useNavigate } from "react-router-dom";
import { clearTokens } from "../utils/tokenUtils";
import { useAuthContext } from "../context/AuthContext";
import { buttonConfig } from "../config/buttonConfig";
import { Button } from "../components/common/Button";

const LogoutButton = () => {
  const navigate = useNavigate();
  const { setIsAuthenticated } = useAuthContext();

  const handleLogout = () => {
    clearTokens();
    setIsAuthenticated(false);
    navigate("/login");
  };

  const logoutButtonConfig = buttonConfig({
    isLogout: true,
    handleLogout: handleLogout,
  })[0];

  return (
    <Button
      type={logoutButtonConfig.type}
      text={logoutButtonConfig.text}
      onClick={logoutButtonConfig.onClick}
      className={logoutButtonConfig.className}
    />
  );
};

export default LogoutButton;
