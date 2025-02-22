import { Route, Navigate } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";
import Profile from "../../pages/Profile";
import PortfolioDashboard from "../investor/pages/PortfolioDashboard";
import PageSlider from "../../pages/PageSlider";
import Loan from "../../pages/Loan";
import LoanForm from "../../pages/LoanForm";
import SubmitLoan from "../../pages/SubmitLoan";
import LoanDetails from "../../pages/LoanDetails";
import UpdateLoanDetails from "../../pages/UpdateLoanDetails";
import LoanList from "../../pages/LoanList";
import Dashboard from "../../pages/Dashboard";
import EmiCalculator from "../../pages/EmiCalc";

const PrivateRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useAuthContext(); 

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/not-authorized" />;
  }

  return children;
};

export const privateRoutes = (
  <>
    
    <Route
      path="/profile"
      element={
        <PrivateRoute allowedRoles={["investor", "user"]}>
          <Profile />
        </PrivateRoute>
      }
    />
    <Route
      path="/dashboard"
      element={
        <PrivateRoute allowedRoles={["investor", "user"]}>
          <Dashboard />
        </PrivateRoute>
      }
    />
    <Route
      path="/emi"
      element={
        <PrivateRoute allowedRoles={["investor", "user"]}>
          <EmiCalculator />
        </PrivateRoute>
      }
    />

    <Route
      path="/portfolio"
      element={
        <PrivateRoute allowedRoles={["investor"]}>
          <PortfolioDashboard />
        </PrivateRoute>
      }
    />

 
    <Route
      path="/upload"
      element={
        <PrivateRoute allowedRoles={["user"]}>
          <PageSlider />
        </PrivateRoute>
      }
    />
    <Route
      path="/loan"
      element={
        <PrivateRoute allowedRoles={["user"]}>
          <Loan />
        </PrivateRoute>
      }
    />
    <Route
      path="/loan/form"
      element={
        <PrivateRoute allowedRoles={["user"]}>
          <LoanForm />
        </PrivateRoute>
      }
    />
    <Route
      path="/loan/submit"
      element={
        <PrivateRoute allowedRoles={["user"]}>
          <SubmitLoan />
        </PrivateRoute>
      }
    />
    <Route
      path="/loan/details"
      element={
        <PrivateRoute allowedRoles={["user"]}>
          <LoanDetails />
        </PrivateRoute>
      }
    />
    <Route
      path="/loan/update"
      element={
        <PrivateRoute allowedRoles={["user"]}>
          <UpdateLoanDetails />
        </PrivateRoute>
      }
    />
    <Route
      path="/loanl"
      element={
        <PrivateRoute allowedRoles={["user"]}>
          <LoanList />
        </PrivateRoute>
      }
    />
  </>
);

export default PrivateRoute;
