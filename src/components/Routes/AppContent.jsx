// src/AppContent.js
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";
import { publicRoutes } from "./PublicRoute"; // Import public routes
import { privateRoutes } from "./PrivateRoute"; // Import private routes
import NotFound from "../../pages/NotFound";

const AppContent = () => {
  const { isAuthenticated } = useAuthContext();

  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />}
      />

      {publicRoutes}

      {privateRoutes}

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppContent;
