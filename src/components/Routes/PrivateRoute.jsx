import { Route, Navigate } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";
import Profile from "../../pages/Profile";
import PageSlider from "../../pages/PageSlider";
import Loan from "../../pages/Loan";
import LoanForm from "../../pages/LoanForm";
import SubmitLoan from "../../pages/SubmitLoan";
import LoanDetails from "../../pages/LoanDetails";
import UpdateLoanDetails from "../../pages/UpdateLoanDetails";
import LoanList from "../../pages/LoanList";
import Dashboard from "../../pages/Dashboard";
import EmiCalculator from "../../pages/EmiCalc";
import LoanListPage from "../../pages/LoanListpage";
import RepaymentSchedule from "../../pages/Repay";
import Support from "../../pages/Support";
import FAQ from "../../pages/FAQ";
import ProfileUpdate from "../../pages/ProfileUpdate";

import Home from "../../pages/Home";

import Layout from "../investor/layout/layout";
import AdminLayout from "../admin/layout/adminLayout";

import PortfolioDashboard from "../investor/pages/PortfolioDashboard";
import InvestmentOpportunities from "../investor/pages/OppPage";
import FeedbackForm from "../investor/pages/FeedbackForm";
import { EarningsRepayment } from "../investor/pages/EarningPage";
import ReportsAnalytics from "../investor/pages/ReportPage";
import NotificationSettings from "../investor/pages/NotificationSetting";

//admin

import AdminDashboard from "../admin/pages/AdminDashboard";
import CustomerManagement from "../admin/pages/CustomerManagement";
import InvestorManagement from "../admin/pages/InvestorManagement";
import LoanManagement from "../admin/pages/LoanManagement";
import InvestmentAllocation from "../admin/pages/InvestmentAllocation";
import AdminReportsAnalytics from "../admin/pages/ReportsAnalytics";
import DirectMessaging from "../admin/pages/DirectMessaging";
import AuditLogs from "../admin/pages/AuditLogs";
import InterestFeeManagement from "../admin/pages/InterestFeeManagement";
import Settings from "../admin/pages/Settings";
import TicketOverview from "../admin/pages/TicketOverview";
import UserAccessControl from "../admin/pages/UserAccessControl";

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
      path="/home"
      element={
        <PrivateRoute allowedRoles={["investor", "user", "admin"]}>
          <Home />
        </PrivateRoute>
      }
    />
    <Route
      path="/"
      element={
        <PrivateRoute allowedRoles={["investor", "user"]}>
          <Home />
        </PrivateRoute>
      }
    />
    <Route
      path="/loan-list"
      element={
        <PrivateRoute allowedRoles={["investor", "user"]}>
          <LoanListPage />
        </PrivateRoute>
      }
    />
    <Route
      path="/support"
      element={
        <PrivateRoute allowedRoles={["investor", "user", "admin"]}>
          <Support />
        </PrivateRoute>
      }
    />
    <Route
      path="/faq"
      element={
        <PrivateRoute allowedRoles={["investor", "user", "admin"]}>
          <FAQ />
        </PrivateRoute>
      }
    />
    <Route
      path="/repay"
      element={
        <PrivateRoute allowedRoles={["user"]}>
          <RepaymentSchedule />
        </PrivateRoute>
      }
    />

    <Route
      path="/profile"
      element={
        <PrivateRoute allowedRoles={["investor", "user", "admin"]}>
          <Profile />
        </PrivateRoute>
      }
    />
    <Route
      path="/profile/update"
      element={
        <PrivateRoute allowedRoles={["investor", "user"]}>
          <ProfileUpdate />
        </PrivateRoute>
      }
    />
    <Route
      path="/notification"
      element={
        <PrivateRoute allowedRoles={["investor", "user", "admin"]}>
          <NotificationSettings />
        </PrivateRoute>
      }
    />
    <Route
      path="/feedback"
      element={
        <PrivateRoute allowedRoles={["investor", "user", "admin"]}>
          <FeedbackForm />
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
    <Route path="/" element={<Layout />}>
      <Route
        path="earnings-repayment"
        element={
          <PrivateRoute allowedRoles={["investor"]}>
            <EarningsRepayment />
          </PrivateRoute>
        }
      />
      <Route
        path="report"
        element={
          <PrivateRoute allowedRoles={["investor"]}>
            <ReportsAnalytics />
          </PrivateRoute>
        }
      />
      <Route
        path="portfolio"
        element={
          <PrivateRoute allowedRoles={["investor"]}>
            <PortfolioDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="make-investment"
        element={
          <PrivateRoute allowedRoles={["investor"]}>
            <InvestmentOpportunities />
          </PrivateRoute>
        }
      />
    </Route>

    <Route path="/admin" element={<AdminLayout />}>
      <Route
        path="dashboard"
        element={
          <PrivateRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="customer"
        element={
          <PrivateRoute allowedRoles={["admin"]}>
            <CustomerManagement />
          </PrivateRoute>
        }
      />
      <Route
        path="investor"
        element={
          <PrivateRoute allowedRoles={["admin"]}>
            <InvestorManagement />
          </PrivateRoute>
        }
      />
      <Route
        path="loan"
        element={
          <PrivateRoute allowedRoles={["admin"]}>
            <LoanManagement />
          </PrivateRoute>
        }
      />
      <Route
        path="investment"
        element={
          <PrivateRoute allowedRoles={["admin"]}>
            <InvestmentAllocation />
          </PrivateRoute>
        }
      />
      <Route
        path="report"
        element={
          <PrivateRoute allowedRoles={["admin"]}>
            <AdminReportsAnalytics />
          </PrivateRoute>
        }
      />
      <Route
        path="messanger"
        element={
          <PrivateRoute allowedRoles={["admin"]}>
            <DirectMessaging />
          </PrivateRoute>
        }
      />
      <Route
        path="audit"
        element={
          <PrivateRoute allowedRoles={["admin"]}>
            <AuditLogs />
          </PrivateRoute>
        }
      />
      <Route
        path="intrest-management"
        element={
          <PrivateRoute allowedRoles={["admin"]}>
            <InterestFeeManagement />
          </PrivateRoute>
        }
      />
      <Route
        path="setting"
        element={
          <PrivateRoute allowedRoles={["admin"]}>
            <Settings />
          </PrivateRoute>
        }
      />
      <Route
        path="ticket-review"
        element={
          <PrivateRoute allowedRoles={["admin"]}>
            <TicketOverview />
          </PrivateRoute>
        }
      />
      <Route
        path="user-access-control"
        element={
          <PrivateRoute allowedRoles={["admin"]}>
            <UserAccessControl />
          </PrivateRoute>
        }
      />
    </Route>
  </>
);

export default PrivateRoute;
