import React, { useEffect, useState } from "react";
import styles from "./style/Repay.module.css";
import { Button } from "../components/common/Button";
import { IconBtn } from "../components/common/IconBtn";
import { Infoicon } from "../components/common/assets";

const RepaymentSchedule = () => {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRepaymentSchedule();
  }, []);

  // const fetchRepaymentSchedule = async () => {
  //   try {
  //     const response = await fetch("http://localhost:5000/api/auth/schedule", {
  //       method: "GET",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ loan_id: "102" }),
  //     });
  //     const data = await response.json();
  //     setSchedule(data.schedule);
  //   } catch (err) {
  //     setError("Failed to fetch schedule");
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  // ... existing imports and code ...

  const fetchRepaymentSchedule = () => {
    setTimeout(() => {
      const fakeSchedule = [
        {
          due_date: "2024-02-15",
          amount: 4442.44,
          status: "Paid",
        },
        {
          due_date: "2024-03-15",
          amount: 4442.44,
          status: "Pending",
        },
        {
          due_date: "2024-04-15",
          amount: 4442.44,
          status: "Pending",
        },
        {
          due_date: "2024-05-15",
          amount: 4442.44,
          status: "Pending",
        },
        {
          due_date: "2024-06-15",
          amount: 4442.44,
          status: "Pending",
        },
        {
          due_date: "2024-07-15",
          amount: 4442.44,
          status: "Pending",
        },
      ];
      setSchedule(fakeSchedule);
      setLoading(false);
    }, 800);
  };

  // ... rest of the component code ...
  const handlePayment = async (repaymentId) => {
    // Payment processing logic here
    alert(`Processing payment for repayment ID: ${repaymentId}`);
  };

  if (loading) return <p>Loading repayment schedule...</p>;
  if (error) return <p className={styles.error}>{error}</p>;

  return (
    <div className={styles.container}>
      <h2>Repayment Schedule</h2>
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className="py-2 px-4 text-left">Due Date</th>
              <th className="py-2 px-4 text-left">EMI Amount</th>
              <th className="py-2 px-4 text-left">Status</th>
              <th className="py-2 px-4 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {schedule.map((repayment) => (
              <tr key={repayment.due_date}>
                <td className="py-2 px-4 text-left">{repayment.due_date}</td>
                <td className="py-2 px-4 text-left">{repayment.amount}</td>
                <td className="py-2 px-4 text-left"> {repayment.status}</td>
                <td className={styles.btnContainer}>
                  {repayment.status === "Pending" && (
                    <>
                      <Button
                        onClick={() => handlePayment(repayment.due_date)}
                        text="Make Payment"
                      />
                      <IconBtn icon=<Infoicon /> onClick={console.log("hi")} />
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RepaymentSchedule;
