import React, { useState, useEffect } from "react";
import styles from "./style/LoanManagement.module.css";
import { IconBtn } from "../../common/IconBtn";
import { EyeIcon, CheckIcon, CloseIcon, Infoicon } from "../../common/assets";
import { API_BASE_URL } from "../../../config";
import { useNavigate } from "react-router-dom";
import { Loader } from "../../common/Loader";
// Add these to your existing imports
import { PrevIcon, Nexticon } from "../../common/assets";
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

      await updateLoanStatus(accessToken, loanId, loanStatus[loanId]);

      console.log("Status updated for loan:", loanId);
      setLoanStatus((prevState) => ({
        ...prevState,
        [loanId]: "",
      }));
      fetchLoans();
    } catch (error) {
      console.error("Error updating loan status:", error.message);
      alert(error.message);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  const handleViewDetails = (loan) => {
    setSelectedLoan(loan);
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
        <IconBtn icon={<Infoicon />} onClick={() => handleViewDetails(loan)} />
        {loan.status === "Under Review" && (
          <>
            <select
              value={loanStatus[loan.loan_id] || ""}
              onChange={(e) => handleStatusChange(loan.loan_id, e.target.value)}
              className={styles.input}
            >
              <option value="">Select Status</option>
              {validTransitions[loan.status]?.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            <IconBtn
              icon={<CheckIcon />}
              onClick={() => handleApproveReject(loan.loan_id)}
              disabled={!loanStatus[loan.loan_id]}
            />
          </>
        )}
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
            <h3>Loan Application #{selectedLoan.loan_id}</h3>
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
            <IconBtn
              icon={<CloseIcon />}
              onClick={() => setIsModalVisible(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ApprovedLoansManagement;
