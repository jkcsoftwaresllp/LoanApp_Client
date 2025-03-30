import React, { useState, useEffect } from "react";
import styles from "./style/CustomerManagement.module.css";
import { Button } from "../../common/Button";
import { IconBtn } from "../../common/IconBtn";
import { PrevIcon, Nexticon } from "../../common/assets";
import { Loader } from "../../common/Loader";
import { showToast } from "../../../utils/toastUtils";
import {
  fetchCustomers,
  updateUserStatus,
  deleteUser,
} from "./helper/customerManagementHelper";

const CustomerManagement = () => {
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [filters, setFilters] = useState({ status: "active", date: null });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const fetchCustomersData = async () => {
    try {
      setIsLoading(true);
      const data = await fetchCustomers();

      // Apply frontend filtering
      const filteredData = data.filter((customer) => {
        // Status filter (case insensitive)
        if (
          filters.status &&
          customer.status.toLowerCase() !== filters.status.toLowerCase()
        ) {
          return false;
        }

        // Date filter (if implemented)
        if (filters.date) {
          // Add your date filtering logic here if needed
        }

        return true;
      });

      setCustomers(filteredData);
    } catch (error) {
      console.error("Error in component:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomersData();
  }, [filters.status, filters.date]); // Add all filter properties here

  const handleEdit = (customer) => {
    setSelectedCustomer(customer);
    setIsModalVisible(true);
  };

  const handleDeactivate = async (customer) => {
    try {
      await updateUserStatus(customer);
      showToast(
        "success",
        `User ${customer.user_id} has been ${
          customer.status === "active" ? "deactivated" : "reactivated"
        }`
      );
      fetchCustomersData();
    } catch (error) {
      console.error("Error in component:", error);
      showToast(
        "error",
        `Failed to ${
          customer.status === "active" ? "deactivate" : "reactivate"
        } user ${customer.user_id}`
      );
    }
  };

  const handleDelete = async (customer) => {
    try {
      await deleteUser(customer);
      showToast(
        "success",
        `User ${customer.user_id} has been deleted successfully`
      );
      fetchCustomersData();
    } catch (error) {
      console.error("Error in component:", error);
      showToast("error", `Failed to delete user ${customer.user_id}`);
    }
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
      {isLoading ? (
        <div className={styles.center}>
          <Loader />
        </div>
      ) : (
        <>
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
              {/* <input
                type="date"
                className={styles.filterSelect}
                onChange={(e) => handleFilterChange("date", e.target.value)}
              /> */}

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
                    <th className="py-2 px-4 text-left">Email</th>
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
                <p>
                  Contact: <b> {selectedCustomer.mobile_number}</b>
                </p>
                <p>
                  Status:<b> {selectedCustomer.status}</b>
                </p>
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
                  <Button
                    text="Delete User"
                    onClick={() => handleDelete(selectedCustomer)}
                    className={styles.deleteButton}
                  />
                  <Button
                    text="Close"
                    onClick={() => setIsModalVisible(false)}
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

export default CustomerManagement;

const TableRow = React.memo(
  ({ index, customer, handleEdit, handleDeactivate }) => (
    <tr key={customer._id} className={styles.row}>
      <td className="py-2 px-4 text-center">{index}</td>
      <td className="py-2 px-4 text-left">{customer.user_id || "N/A"}</td>
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
