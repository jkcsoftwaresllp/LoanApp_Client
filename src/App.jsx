import { BrowserRouter } from "react-router-dom";  // Import BrowserRouter
import { AuthProvider } from "./context/AuthContext";
import { LoanProvider } from "./context/LoanContext";
import AppContent from "./components/Routes/AppContent"; 
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <LoanProvider>
          <AppContent />
          <ToastContainer /> 
        </LoanProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
