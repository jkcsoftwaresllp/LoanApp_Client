// src/AppContent.js
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";
import { publicRoutes } from "./PublicRoute";  // Import public routes
import { privateRoutes } from "./PrivateRoute"; // Import private routes

const AppContent = () => {
  const { isAuthenticated } = useAuthContext();

  return (
    <Routes>
      {/* Root redirection */}
      <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />

      {/* Public routes */}
      {publicRoutes}

      {/* Private routes */}
      {privateRoutes}

      {/* 404 Route */}
      <Route path="*" element={<div>404 - Page Not Found</div>} />
    </Routes>
  );
};

export default AppContent;
