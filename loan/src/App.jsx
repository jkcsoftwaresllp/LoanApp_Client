import { BrowserRouter as Router, Route, Navigate, Routes } from "react-router-dom";
import { AuthProvider, useAuthContext } from "./context/AuthContext";
import Login from "./pages/Login";
import Logout from "./pages/Logout";
import Register from "./pages/Register";
import FileUploadPage from "./pages/FileUploadPage";
import Profile from "./pages/Profile";
import { ToastContainer } from "react-toastify";  
import "react-toastify/dist/ReactToastify.css";  


const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuthContext();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const AppContent = () => {
  const { isAuthenticated } = useAuthContext();

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to={isAuthenticated ? "/profile" : "/login"} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="/logout" element={<PrivateRoute><Logout /></PrivateRoute>} />
        <Route path="/file" element={<PrivateRoute><FileUploadPage /></PrivateRoute>} />
        <Route path="*" element={<div>404 - Page Not Found</div>} />
      </Routes>
      <ToastContainer /> {/* Add the ToastContainer here */}
    </Router>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
