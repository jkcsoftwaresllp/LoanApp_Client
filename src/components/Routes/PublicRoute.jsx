import { Route, Navigate } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";
import Login from "../../pages/Login";
import Register from "../../pages/Register";
import AdminLogin from "../../pages/AdminLogin";
import AdminRegister from "../../pages/AdminRegister";

const PublicRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthContext();

  if (isAuthenticated) {
    return <Navigate to={user?.role === "investor" ? "/home" : "/home"} />;
  }

  return children;
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
    //admin
    <Route
      path="/alogin"
      element={
        <PublicRoute>
          <AdminLogin />
        </PublicRoute>
      }
    />
    <Route
      path="/aregister"
      element={
        <PublicRoute>
          <AdminRegister />
        </PublicRoute>
      }
    />
  </>
);

export default PublicRoute;
