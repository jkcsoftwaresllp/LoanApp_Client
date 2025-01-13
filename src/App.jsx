import { BrowserRouter as Router, Route, Navigate, Routes } from "react-router-dom";
import { AuthProvider, useAuthContext } from "./context/AuthContext";
import { LoanProvider } from "./context/LoanContext";  // Import LoanProvider
import Login from "./pages/Login";
import Logout from "./pages/LogoutButton";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import { ToastContainer } from "react-toastify";  
import "react-toastify/dist/ReactToastify.css";  
import PageSlider from "./pages/PageSlider";  // File upload page
import LoanApplication from "./pages/LoanApplication";  // Loan application page
import LoanConfirmation from "./pages/LoanConfirmation";  // Loan confirmation page

// PrivateRoute for handling authenticated routes
const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuthContext();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const AppContent = () => {
  const { isAuthenticated } = useAuthContext();

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="/logout" element={<PrivateRoute><Logout /></PrivateRoute>} />
        
        {/* Loan Application Pages */}
        <Route path="/loan" element={<PrivateRoute><LoanApplication /></PrivateRoute>} />  {/* Loan application page */}
        <Route path="/lc" element={<PrivateRoute><LoanConfirmation /></PrivateRoute>} />  {/* Loan confirmation page */}
        
        {/* Dashboard for loan status */}
        
        {/* File upload */}
        <Route path="/upload" element={<PrivateRoute><PageSlider /></PrivateRoute>} />

        <Route path="*" element={<div>404 - Page Not Found</div>} />
      </Routes>
      <ToastContainer /> {/* Add the ToastContainer here for global toast notifications */}
    </Router>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <LoanProvider> {/* Wrap the app with LoanProvider to provide the context */}
        <AppContent />
      </LoanProvider>
    </AuthProvider>
  );
};

export default App;
