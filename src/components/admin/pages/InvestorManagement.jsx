import React, { useState, useEffect } from "react";
import styles from "./style/InvestorManagement.module.css";
import { Button } from "../../common/Button";

const InvestorManagement = () => {
  const [investors, setInvestors] = useState([]);
  const [selectedInvestor, setSelectedInvestor] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const fetchInvestors = async () => {
    const fakeData = [
      {
        investor_id: 1,
        name: "Jane Smith",
        portfolio_value: 500000,
        status: "active",
        earnings: 25000,
        active_loans: 15,
      },
      {
        investor_id: 2,
        name: "John Doe",
        portfolio_value: 750000,
        status: "inactive",
        earnings: 45000,
        active_loans: 22,
      },
      {
        investor_id: 21,
        name: "Jane Smith",
        portfolio_value: 500000,
        status: "active",
        earnings: 25000,
        active_loans: 15,
      },
      {
        investor_id: 22,
        name: "John Doe",
        portfolio_value: 750000,
        status: "inactive",
        earnings: 45000,
        active_loans: 22,
      },
    ];
    setInvestors(fakeData);
  };

  useEffect(() => {
    fetchInvestors();
  }, []);

  const handleEdit = (investor) => {
    console.log(`Editing investor ${investor.investor_id}`);
    // Implement edit functionality
  };

  const handleViewDetails = (investor) => {
    setSelectedInvestor(investor);
    setIsModalVisible(true);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Investor Management</h2>
      <div className={styles.tableWrapper}>
        <div className={styles.tableContainer}>
          <table>
            <thead>
              <tr>
                <th className="py-2 px-4 text-left">Investor ID</th>
                <th className="py-2 px-4 text-left">Name</th>
                <th className="py-2 px-4 text-left">Portfolio Value</th>
                <th className="py-2 px-4 text-left">Status</th>
                <th className="py-2 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {investors.map((investor) => (
                <TableRow
                  key={investor.investor_id}
                  investor={investor}
                  handleEdit={handleEdit}
                  handleViewDetails={handleViewDetails}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalVisible && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalContent}>
            <h3>{selectedInvestor.name}'s Portfolio</h3>
            <p>
              Portfolio Value: $
              {selectedInvestor.portfolio_value.toLocaleString()}
            </p>
            <p>Total Earnings: ${selectedInvestor.earnings.toLocaleString()}</p>
            <p>Active Loans: {selectedInvestor.active_loans}</p>
            <Button text="Close" onClick={() => setIsModalVisible(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default InvestorManagement;

const TableRow = React.memo(({ investor, handleEdit, handleViewDetails }) => (
  <tr key={investor.investor_id} className={styles.row}>
    <td className="py-2 px-4 text-center">{investor.investor_id}</td>
    <td className="py-2 px-4 text-left">{investor.name}</td>
    <td className="py-2 px-4 text-left">
      ${investor.portfolio_value.toLocaleString()}
    </td>
    <td className="py-2 px-4 text-left">{investor.status}</td>
    <td className={styles.action}>
      <Button onClick={() => handleEdit(investor)} text="Edit" />
      <Button onClick={() => handleViewDetails(investor)} text="View" />
    </td>
  </tr>
));
