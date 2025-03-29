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
  const [loading, setLoading] = useState(true); // Add loading state

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

  const handleEdit = (investor) => {
    console.log(`Editing investor ${investor.investor_id}`);
  };

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
              <div className={styles.pagination}>
                <IconBtn
                  icon={PrevIcon}
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                />
                <span>{currentPage}</span>
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
                  {currentItems.map((investor, index) => (
                    <TableRow
                      key={investor.investor_id}
                      index={index + 1 + (currentPage - 1) * itemsPerPage}
                      investor={investor}
                      handleEdit={handleEdit}
                      handleViewDetails={handleViewDetails}
                    />
                  ))}
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
