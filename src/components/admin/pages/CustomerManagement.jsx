import React, { useState, useEffect } from "react";
import styles from "./style/CustomerManagement.module.css";
import { Button } from "../../common/Button";

const CustomerManagement = () => {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [filters, setFilters] = useState({ status: "active", date: null });

  const fetchCustomers = async () => {
    const fakeData = [
      {
        customer_id: 1,
        name: "John Doe",
        contact: "john@example.com",
        status: "active",
        registration_date: "2023-01-01",
      },
      {
        customer_id: 2,
        name: "Jane Smith",
        contact: "jane@example.com",
        status: "inactive",
        registration_date: "2023-02-15",
      },
      {
        customer_id: 11,
        name: "John Doe",
        contact: "john@example.com",
        status: "active",
        registration_date: "2023-01-01",
      },
      {
        customer_id: 12,
        name: "Jane Smith",
        contact: "jane@example.com",
        status: "inactive",
        registration_date: "2023-02-15",
      },
      {
        customer_id: 21,
        name: "John Doe",
        contact: "john@example.com",
        status: "active",
        registration_date: "2023-01-01",
      },
      {
        customer_id: 22,
        name: "Jane Smith",
        contact: "jane@example.com",
        status: "inactive",
        registration_date: "2023-02-15",
      },
    ];
    setCustomers(fakeData);
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

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>User Management</h2>
      <div className={styles.filters}>
        <select
          className={styles.filterSelect}
          value={filters.status}
          onChange={(e) => handleFilterChange("status", e.target.value)}
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <input
          type="date"
          className={styles.dateInput}
          onChange={(e) => handleFilterChange("date", e.target.value)}
        />
      </div>

      <div className={styles.tableWrapper}>
        <div className={styles.tableContainer}>
          <table>
            <thead>
              <tr>
                <th className="py-2 px-4 text-left">Customer ID</th>
                <th className="py-2 px-4 text-left">Name</th>
                <th className="py-2 px-4 text-left">Contact Info</th>
                <th className="py-2 px-4 text-left">Status</th>
                <th className="py-2 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.customer_id} className={styles.row}>
                  <td className="py-2 px-4 text-center">
                    {customer.customer_id}
                  </td>
                  <td className="py-2 px-4 text-left">{customer.name}</td>
                  <td className="py-2 px-4 text-left">{customer.contact}</td>
                  <td className="py-2 px-4 text-left">{customer.status}</td>
                  <td className={styles.action}>
                    <Button text="Edit" onClick={() => handleEdit(customer)} />

                    <Button
                      onClick={() => handleDeactivate(customer)}
                      text={
                        customer.status === "active"
                          ? "Deactivate"
                          : "Reactivate"
                      }
                    />
                  </td>
                </tr>
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
