import React, { useState, useEffect } from "react";
import styles from "./style/LoanManagement.module.css";
import { IconBtn } from "../../common/IconBtn";
import { EyeIcon, CheckIcon, CloseIcon, Infoicon } from "../../common/assets";
import { API_BASE_URL } from "../../../config";
import { useNavigate } from "react-router-dom";
import { Loader } from "../../common/Loader";
import { Button } from "../../common/Button";
import { showToast } from "../../../../src/utils/toastUtils";
import { PrevIcon, Nexticon, AddIcon } from "../../common/assets";
import {
  fetchApprovedLoans,
  updateLoanStatus,
  filterLoans,
} from "./helper/approvedLoanHelper";

const ApprovedLoansManagement = () => {
  const [loans, setLoans] = useState([]);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loanStatus, setLoanStatus] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(true);
  const [investors, setInvestors] = useState([]);
  const [selectedInvestors, setSelectedInvestors] = useState({});
  const [isInvestorModalVisible, setIsInvestorModalVisible] = useState(false);
  const [currentLoanForInvestors, setCurrentLoanForInvestors] = useState(null);
  const [selectedInvestor, setSelectedInvestor] = useState(null); // Add state for selected investor

  // Define allowed status transitions
  const validTransitions = {
    Draft: ["Pending"],
    Pending: ["Under Review", "Rejected"],
    "Under Review": ["Approved", "Rejected"],
    Approved: ["Paid"],
    Rejected: [],
    Paid: [],
    Expired: [],
  };
  const handleAddInvestors = async (loanId) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        console.error("No access token found");
        return;
      }

      const payload = {
        loan_id: loanId,
        investor_ids: selectedInvestors[loanId] || [],
      };
      console.log("Add Investors API Payload:", payload);

      const response = await fetch(`${API_BASE_URL}auth/addinvestor`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      showToast("success", "Investors added successfully!");
      setIsInvestorModalVisible(false);
      fetchLoans();
    } catch (error) {
      console.error("Error adding investors:", error.message);
      showToast("error", error.message);
    }
  };

  const [filters, setFilters] = useState({ status: "active" }); // Add filters state
  const [loading, setLoading] = useState(false); // Add loading state

  const fetchInvestors = async () => {
    setLoading(true); // Set loading true before fetch
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        console.error("No access token found");
        return;
      }

      const response = await fetch(
        `${API_BASE_URL}auth/admin-investor-details?status=${filters.status}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("API Error:", errorData);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      setInvestors(data.investors);
    } catch (error) {
      console.error("Error fetching investors:", error.message);
    } finally {
      setLoading(false); // Set loading false after fetch
    }
  };

  useEffect(() => {
    fetchInvestors();
  }, [filters]);

  const handleInvestorSelection = (loanId, investorId, isSelected) => {
    setSelectedInvestors((prev) => ({
      ...prev,
      [loanId]: isSelected
        ? [...(prev[loanId] || []), investorId]
        : (prev[loanId] || []).filter((id) => id !== investorId),
    }));
  };

  const fetchLoans = async () => {
    setIsLoading(true);
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        console.error("No access token found");
        return;
      }

      const result = await fetchApprovedLoans(accessToken);
      const filteredLoans = filterLoans(result.data);
      setLoans(filteredLoans);
      console.log("Filtered Loans (excluding Pending):", filteredLoans);
    } catch (error) {
      console.error("Error fetching loans:", error.message);
      setLoans([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveReject = async (loanId) => {
    if (!loanStatus[loanId]) {
      console.error("Please select a status");
      return;
    }

    setIsLoading(true);
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        console.error("No access token found");
        return;
      }

      const currentLoan = loans.find((loan) => loan.loan_id === loanId);
      if (!currentLoan) {
        console.error("Loan not found");
        return;
      }

      const response = await fetch(`${API_BASE_URL}auth/admin-update-status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          loan_id: loanId.toString(),
          status: loanStatus[loanId], // Send exact case as backend expects
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        // Handle specific error codes from backend
        if (result.uniqueCode === "INV35" || result.uniqueCode === "INV36") {
          alert(result.message); // Show investment eligibility error to user
        }
        throw new Error(
          result.message || `HTTP error! status: ${response.status}`
        );
      }

      showToast("info", `Status updated for loan: ${loanId}`);
      setLoanStatus((prevState) => ({
        ...prevState,
        [loanId]: "",
      }));
      fetchLoans();
    } catch (error) {
      console.error("Error updating loan status:", error.message);
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  const handleViewDetails = async (loan) => {
    if (loan.status === "Approved") {
      try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
          console.error("No access token found");
          return;
        }

        const response = await fetch(
          `${API_BASE_URL}auth/status/${loan.loan_id}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
              loan_id: loan.loan_id,
            }),
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const detailedLoan = await response.json();
        setSelectedLoan({ ...loan, ...detailedLoan });
      } catch (error) {
        console.error("Error fetching loan details:", error);
        showToast("error", "Failed to fetch loan details");
        setSelectedLoan(loan);
      }
    } else {
      setSelectedLoan(loan);
    }
    setIsModalVisible(true);
  };

  const handleStatusChange = (loanId, status) => {
    setLoanStatus((prevState) => ({
      ...prevState,
      [loanId]: status,
    }));
  };

  const TableRow = React.memo(({ loan }) => (
    <tr key={loan.loan_id} className={styles.row}>
      <td className="py-2 px-4 text-center">{loan.loan_id}</td>
      <td className="py-2 px-4 text-left">{loan.borrower_name}</td>
      <td className="py-2 px-4 text-left">₹{loan.amount.toLocaleString()}</td>
      <td className="py-2 px-4 text-left">{loan.status}</td>
      <td className={styles.action}>
        <div className={styles.buttonContainer}>
          {loan.status === "Under Review" && (
            <>
              <IconBtn
                icon={<AddIcon />}
                onClick={() => {
                  setCurrentLoanForInvestors(loan);
                  setIsInvestorModalVisible(true);
                  fetchInvestors();
                }}
              />
            </>
          )}
          <IconBtn
            icon={<Infoicon />}
            onClick={() => handleViewDetails(loan)}
          />
        </div>
      </td>
    </tr>
  ));

  // Add filtered loans calculation
  const filteredLoans = loans.filter((loan) =>
    loan.loan_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentLoans = filteredLoans.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);
  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Approved & Under Review Loans</h2>

      {/* Add search and pagination controls */}
      <div className={styles.filters}>
        <div className={styles.filterRow}>
          <input
            type="text"
            placeholder="Search by Loan ID"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className={styles.filterSelect}
          />
        </div>
        <div className={styles.filterRow}>
          <div className={styles.pagination}>
            <IconBtn
              icon={PrevIcon}
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            />
            <span>{currentPage}</span>
            <IconBtn
              icon={Nexticon}
              disabled={indexOfLastItem >= filteredLoans.length}
              onClick={() => handlePageChange(currentPage + 1)}
            />
          </div>
          <select
            value={itemsPerPage}
            onChange={(e) => handleItemsPerPageChange(e.target.value)}
            className={styles.filterSelect}
          >
            <option value={10}>10 per page</option>
            <option value={25}>25 per page</option>
            <option value={50}>50 per page</option>
          </select>
        </div>
      </div>

      <div className={styles.tableWrapper}>
        {isLoading ? (
          <div className={styles.loaderContainer}>
            <Loader />
          </div>
        ) : (
          <div className={styles.tableContainer}>
            <table>
              <thead>
                <tr>
                  <th className="py-2 px-4 text-left">Loan ID</th>
                  <th className="py-2 px-4 text-left">Borrower Name</th>
                  <th className="py-2 px-4 text-left">Amount</th>
                  <th className="py-2 px-4 text-left">Status</th>
                  <th className="py-2 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentLoans.length > 0 ? (
                  currentLoans.map((loan) => (
                    <TableRow key={loan.loan_id} loan={loan} />
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center">
                      {searchTerm
                        ? "No matching loans found"
                        : "No approved or under review loans found"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {isModalVisible && selectedLoan && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>Loan Application #{selectedLoan.loan_id}</h3>
              <p
                className={styles.closeButton}
                onClick={() => setIsModalVisible(false)}
              >
                <CloseIcon />
              </p>
            </div>
            <p>Borrower: {selectedLoan.borrower_name}</p>
            <p>Amount: ₹{selectedLoan.amount.toLocaleString()}</p>
            <p>Status: {selectedLoan.status}</p>
            <div className={styles.documents}>
              <p>
                <b>Attached Documents:</b>
              </p>
              {Array.isArray(selectedLoan.documents) ? (
                selectedLoan.documents.map((doc, index) => (
                  <div key={index} className={styles.documentItem}>
                    {doc}
                    <IconBtn icon={<EyeIcon />} />
                  </div>
                ))
              ) : (
                <p>No documents available</p>
              )}
            </div>
          </div>
        </div>
      )}
      {isInvestorModalVisible && currentLoanForInvestors && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalContent}>
            <h3>
              Select Investors for Loan #{currentLoanForInvestors.loan_id}
            </h3>
            <div className={styles.investorList}>
              {investors.map((investor) => (
                <div key={investor.investor_id} className={styles.investorItem}>
                  <input
                    type="checkbox"
                    id={`investor-${investor.investor_id}`}
                    checked={(
                      selectedInvestors[currentLoanForInvestors.loan_id] || []
                    ).includes(investor.investor_id)}
                    onChange={(e) =>
                      handleInvestorSelection(
                        currentLoanForInvestors.loan_id,
                        investor.investor_id,
                        e.target.checked
                      )
                    }
                  />
                  <div className={styles.investorSelect}>
                    <label
                      htmlFor={`investor-${investor.investor_id}`}
                      className={styles.p}
                    >
                      {investor.investor_id} - {investor.name}
                    </label>
                    {/* Move the IconBtn to a new div with a class for styling */}
                    <div className={styles.infoButtonContainer}>
                      <p onClick={() => setSelectedInvestor(investor)}>
                        <Infoicon />
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className={styles.modalActions}>
              <Button
                onClick={() =>
                  handleAddInvestors(currentLoanForInvestors.loan_id)
                }
                text="Submit"
                disabled={
                  !selectedInvestors[currentLoanForInvestors.loan_id]?.length
                }
              />
              <Button
                onClick={() => setIsInvestorModalVisible(false)}
                text="Cancel"
              />
            </div>
          </div>
        </div>
      )}
      {selectedInvestor && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalContent}>
            <h3>Investor Details</h3>
            <p>Investor ID: {selectedInvestor.investor_id}</p>
            <p>Name: {selectedInvestor.name}</p>
            <p>Portfolio Value: {selectedInvestor.portfolio_value}</p>
            <p>Status: {selectedInvestor.status}</p>
            <Button onClick={() => setSelectedInvestor(null)} text="Close" />
          </div>
        </div>
      )}
    </div>
  );
};

export default ApprovedLoansManagement;
