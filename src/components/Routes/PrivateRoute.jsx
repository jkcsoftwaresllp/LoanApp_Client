import { Route, Navigate } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";
import Profile from "../../pages/Profile";
import Logout from "../../pages/LogoutButton";
import PageSlider from "../../pages/PageSlider";
import Loan from "../../pages/Loan";
import LoanForm from '../../pages/LoanForm';
import SubmitLoan from '../../pages/SubmitLoan';
import LoanDetails from '../../pages/LoanDetails';
import UpdateLoanDetails from '../../pages/UpdateLoanDetails';
import LoanList from "../../pages/LoanList";

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuthContext();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

export const privateRoutes = (
  <>
    <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
    <Route path="/logout" element={<PrivateRoute><Logout /></PrivateRoute>} />
    <Route path="/upload" element={<PrivateRoute><PageSlider /></PrivateRoute>} />
    <Route path="/loan" element={<PrivateRoute><Loan /></PrivateRoute>} />
    <Route path="/loan/form" element={<PrivateRoute><LoanForm /></PrivateRoute>} />
    <Route path="/loan/submit" element={<PrivateRoute><SubmitLoan /></PrivateRoute>} />
    <Route path="/loan/details" element={<PrivateRoute><LoanDetails /></PrivateRoute>} />
    <Route path="/loanl" element={<PrivateRoute><LoanList /></PrivateRoute>} />
    <Route path="/loan/update" element={<PrivateRoute><UpdateLoanDetails /></PrivateRoute>} />
  </>
);

export default PrivateRoute;
