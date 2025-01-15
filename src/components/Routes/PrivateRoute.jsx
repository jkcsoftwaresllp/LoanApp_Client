// src/components/PrivateRoute.js
import { Route, Navigate } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";
import Profile from "../../pages/Profile";
import Logout from "../../pages/LogoutButton";
import LoanApplication from "../../pages/LoanApplication";
import LoanConfirmation from "../../pages/LoanConfirmation";
import PageSlider from "../../pages/PageSlider";

// PrivateRoute component for protected routes
const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuthContext();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Define private routes
export const privateRoutes = (
  <>
    <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
    <Route path="/logout" element={<PrivateRoute><Logout /></PrivateRoute>} />
    <Route path="/loan" element={<PrivateRoute><LoanApplication /></PrivateRoute>} />
    <Route path="/lc" element={<PrivateRoute><LoanConfirmation /></PrivateRoute>} />
    <Route path="/upload" element={<PrivateRoute><PageSlider /></PrivateRoute>} />
  </>
);

export default PrivateRoute;
