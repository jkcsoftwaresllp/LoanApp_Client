import React, { useState, useEffect } from "react";
import styles from "./style/CustomerManagement.module.css";
import { Button } from "../../common/Button";
import { API_BASE_URL } from "../../../config";
import { IconBtn } from "../../common/IconBtn";
import { PrevIcon, Nexticon } from "../../common/assets";

const CustomerManagement = () => {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [filters, setFilters] = useState({ status: "active", date: null });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const fetchCustomers = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await fetch(`${API_BASE_URL}auth/admin-getCustomers`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const { data } = await response.json();

      setCustomers(data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [filters]);

  const handleEdit = (customer) => {
    setSelectedCustomer(customer);
    setIsModalVisible(true);
  };

  const handleDeactivate = async (customer) => {
    const updatedStatus = customer.status === "active" ? "inactive" : "active";
    console.log(
      `PATCH /api/admin/customers/update - ${customer.customer_id} status: ${updatedStatus}`
    );
    fetchCustomers();
  };

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // Add pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = customers.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);
  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>User Management</h2>
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
              disabled={indexOfLastItem >= customers.length}
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
          <input
            type="date"
            className={styles.dateInput}
            onChange={(e) => handleFilterChange("date", e.target.value)}
          />

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
                <th className="py-2 px-4 text-left">Customer ID</th>
                <th className="py-2 px-4 text-left">Name</th>
                <th className="py-2 px-4 text-left">Contact Info</th>
                <th className="py-2 px-4 text-left">Status</th>
                <th className="py-2 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((customer, index) => (
                <TableRow
                  key={customer._id}
                  index={index + 1 + (currentPage - 1) * itemsPerPage}
                  customer={customer}
                  handleEdit={handleEdit}
                  handleDeactivate={handleDeactivate}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalVisible && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalContent}>
            <h3>{selectedCustomer.name}</h3>
            <p>Contact: {selectedCustomer.contact}</p>
            <p>Status: {selectedCustomer.status}</p>
            <div className={styles.action}>
              <Button
                text="Generate report"
                onClick={() =>
                  console.log(
                    "Generate report for",
                    selectedCustomer.customer_id
                  )
                }
              />
              <Button text="Close" onClick={() => setIsModalVisible(false)} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerManagement;

const TableRow = React.memo(
  ({ index, customer, handleEdit, handleDeactivate }) => (
    <tr key={customer._id} className={styles.row}>
      <td className="py-2 px-4 text-center">{index}</td>
      <td className="py-2 px-4 text-center">{customer.user_id || "N/A"}</td>
      <td className="py-2 px-4 text-left">{customer.email}</td>
      <td className="py-2 px-4 text-left">{customer.mobile_number}</td>
      <td className="py-2 px-4 text-left">{customer.status}</td>
      <td className={styles.action}>
        <Button text="Edit" onClick={() => handleEdit(customer)} />
        <Button
          onClick={() => handleDeactivate(customer)}
          text={customer.status === "active" ? "Deactivate" : "Reactivate"}
        />
      </td>
    </tr>
  )
);
