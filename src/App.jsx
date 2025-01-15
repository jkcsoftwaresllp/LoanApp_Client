import { BrowserRouter } from "react-router-dom";  // Import BrowserRouter
import { AuthProvider } from "./context/AuthContext";
import { LoanProvider } from "./context/LoanContext";
import AppContent from "./components/Routes/AppContent"; 

const App = () => {
  return (
    <BrowserRouter> 
      <AuthProvider>
        <LoanProvider>
          <AppContent />
        </LoanProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
