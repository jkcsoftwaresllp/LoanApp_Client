import { Route, Navigate } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";
import Login from "../../pages/Login";
import Register from "../../pages/Register";

const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuthContext();
  return !isAuthenticated ? children : <Navigate to="/dashboard" />;
};

export const publicRoutes = (
  <>
    <Route
      path="/login"
      element={
        <PublicRoute>
          <Login />
        </PublicRoute>
      }
    />
    <Route
      path="/register"
      element={
        <PublicRoute>
          <Register />
        </PublicRoute>
      }
    />
  </>
);

export default PublicRoute;
