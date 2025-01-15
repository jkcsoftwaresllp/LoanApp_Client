// src/components/PublicRoute.js
import { Route, Navigate } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";
import Login from "../../pages/Login";
import Register from "../../pages/Register";

// PublicRoute component for non-authenticated users
const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuthContext();
  return !isAuthenticated ? children : <Navigate to="/dashboard" />;
};

// Define public routes
export const publicRoutes = (
  <>
    <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
    <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
  </>
);

export default PublicRoute;
