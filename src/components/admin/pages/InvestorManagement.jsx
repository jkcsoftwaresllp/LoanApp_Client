import React, { useState, useEffect } from "react";
import styles from "./style/InvestorManagement.module.css";
import { Button } from "../../common/Button";
import { API_BASE_URL } from "../../../config";
import { IconBtn } from "../../common/IconBtn";
import { PrevIcon, Nexticon } from "../../common/assets";
import { Loader } from "../../common/Loader";

const InvestorManagement = () => {
  const [investors, setInvestors] = useState([]);
  const [selectedInvestor, setSelectedInvestor] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [filters, setFilters] = useState({ status: "active" });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // Add search term state
  const [inputValue, setInputValue] = useState(""); // Add input value state

  const fetchInvestors = async () => {
    setLoading(true);
    setError(null);
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

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Error fetching investors");
        setInvestors([]);
        return;
      }

      // Apply frontend filtering
      const filteredData = data.investors.filter((investor) => {
        if (
          searchTerm &&
          !(
            investor.investor_id
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            investor.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
        ) {
          return false;
        }
        return true;
      });

      setInvestors(filteredData);
    } catch (error) {
      console.error("Error fetching investors:", error.message);
      setError("Failed to fetch investors");
      setInvestors([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvestors();
  }, [filters.status, searchTerm]); // Add searchTerm to dependencies

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = investors.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);
  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1);
  };

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // Add new state for edit modal
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingInvestor, setEditingInvestor] = useState(null);

  // Add status update handler
  // Add new state for tracking selected status
  const [selectedStatus, setSelectedStatus] = useState("");

  // Update handleEdit function
  const handleEdit = (investor) => {
    setEditingInvestor(investor);
    setSelectedStatus(investor.status);
    setIsEditModalVisible(true);
  };

  // Modify handleStatusUpdate
  const handleStatusUpdate = async (newStatus) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await fetch(
        `${API_BASE_URL}auth/update-investor-status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            investor_id: editingInvestor.investor_id,
            status: newStatus,
          }),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to update status");
      }

      // Update local state immediately
      setInvestors((prevInvestors) =>
        prevInvestors.map((investor) =>
          investor.investor_id === editingInvestor.investor_id
            ? { ...investor, status: newStatus }
            : investor
        )
      );

      // Close modal and reset states
      setIsEditModalVisible(false);
      setEditingInvestor(null);
      setSelectedStatus("");

      // Fetch fresh data
      fetchInvestors();
    } catch (error) {
      console.error("Error updating investor status:", error);
    }
  };

  // Update the edit modal JSX
  {
    isEditModalVisible && editingInvestor && (
      <div className={styles.modalBackdrop}>
        <div className={styles.modalContent}>
          <h3>Update Investor Status</h3>
          <select
            className={styles.filterSelect}
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <div className={styles.modalActions}>
            <Button
              text="Submit"
              onClick={() => handleStatusUpdate(selectedStatus)}
            />
            <Button
              text="Cancel"
              onClick={() => {
                setIsEditModalVisible(false);
                setSelectedStatus("");
                setEditingInvestor(null);
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  const handleViewDetails = (investor) => {
    setSelectedInvestor(investor);
    setIsModalVisible(true);
  };

  return (
    <div className={styles.container}>
      {loading ? (
        <div className={styles.center}>
          <Loader />
        </div>
      ) : (
        <>
          <h2 className={styles.title}>Investor Management</h2>
          <div className={styles.filters}>
            <div className={styles.filterRow}>
              <input
                type="text"
                placeholder="Search by ID or name"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className={styles.filterSelect}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setSearchTerm(inputValue);
                  }
                }}
              />
            </div>
            <div className={styles.filterRow}>
              <div className={styles.pagination}>
                <IconBtn
                  icon={PrevIcon}
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                />
                <span className={styles.span}>{currentPage}</span>
                <IconBtn
                  icon={Nexticon}
                  disabled={indexOfLastItem >= investors.length}
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
            <div className={styles.filterRow}>
              <select
                className={styles.filterSelect}
                value={filters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className={styles.tableWrapper}>
            <div className={styles.tableContainer}>
              <table>
                <thead>
                  <tr>
                    <th className="py-2 px-4 text-left">S.No</th>
                    <th className="py-2 px-4 text-left">Investor ID</th>
                    <th className="py-2 px-4 text-left">Name</th>
                    <th className="py-2 px-4 text-left">Portfolio Value</th>
                    <th className="py-2 px-4 text-left">Status</th>
                    <th className="py-2 px-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {error ? (
                    <tr>
                      <td colSpan="6" className="text-center">
                        <p className={styles.p}>{error}</p>
                      </td>
                    </tr>
                  ) : currentItems.length > 0 ? (
                    currentItems.map((investor, index) => (
                      <TableRow
                        key={investor.investor_id}
                        index={index + 1 + (currentPage - 1) * itemsPerPage}
                        investor={investor}
                        handleEdit={handleEdit}
                        handleViewDetails={handleViewDetails}
                      />
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center">
                        <div className={styles.center}>
                          <p>Nothing to show</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {isModalVisible && selectedInvestor && (
            <div className={styles.modalBackdrop}>
              <div className={styles.modalContent}>
                <h3>{selectedInvestor.name}'s Portfolio</h3>
                <p>
                  Portfolio Value: ₹
                  {(selectedInvestor.portfolio_value || 0).toLocaleString()}
                </p>
                <p>Status: {selectedInvestor.status}</p>
                <Button text="Close" onClick={() => setIsModalVisible(false)} />
              </div>
            </div>
          )}

          {/* Add Edit Modal Here */}
          {isEditModalVisible && editingInvestor && (
            <div className={styles.modalBackdrop}>
              <div className={styles.modalContent}>
                <h3>Update Investor Status</h3>
                <select
                  className={styles.filterSelect}
                  value={editingInvestor.status}
                  onChange={(e) => handleStatusUpdate(e.target.value)}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
                <div className={styles.modalActions}>
                  <Button
                    text="Cancel"
                    onClick={() => setIsEditModalVisible(false)}
                  />
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default InvestorManagement;

const TableRow = React.memo(
  ({ index, investor, handleEdit, handleViewDetails }) => (
    <tr key={investor.investor_id} className={styles.row}>
      <td className="py-2 px-4 text-center">{index}</td>
      <td className="py-2 px-4 text-center">{investor.investor_id}</td>
      <td className="py-2 px-4 text-left">{investor.name}</td>
      <td className="py-2 px-4 text-left">
        ₹{(investor.portfolio_value || 0).toLocaleString()}
      </td>
      <td className="py-2 px-4 text-left">{investor.status}</td>
      <td className={styles.action}>
        <Button onClick={() => handleEdit(investor)} text="Edit" />
        <Button onClick={() => handleViewDetails(investor)} text="View" />
      </td>
    </tr>
  )
);
