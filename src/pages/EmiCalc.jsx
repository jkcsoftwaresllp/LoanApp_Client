import React, { useState } from "react";
import { Doughnut, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
} from "chart.js";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
  Legend as RechartsLegend,
} from "recharts";
import styles from "./style/emi.module.css";
import { Button } from "../components/common/Button";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement
);

const COLORS = ["#4CAF50", "#FF9800"]; // Define colors for PieChart

const EmiCalculator = () => {
  const [loanAmount, setLoanAmount] = useState(2500000);
  const [interestRate, setInterestRate] = useState(10.5);
  const [loanTenure, setLoanTenure] = useState(20);
  const [emi, setEmi] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);

  const calculateEMI = () => {
    const principal = parseFloat(loanAmount);
    const rate = parseFloat(interestRate) / 12 / 100;
    const tenure = parseFloat(loanTenure) * 12;

    if (rate === 0) {
      setEmi((principal / tenure).toFixed(2));
      setTotalInterest("0.00");
      setTotalPayment(principal.toFixed(2));
      return;
    }

    const emiValue =
      (principal * rate * Math.pow(1 + rate, tenure)) /
      (Math.pow(1 + rate, tenure) - 1);

    const totalPay = emiValue * tenure;
    const totalInt = totalPay - principal;

    setEmi(emiValue.toFixed(2));
    setTotalInterest(totalInt.toFixed(2));
    setTotalPayment(totalPay.toFixed(2));
  };

  const pieData = [
    { name: "Principal Amt.", value: parseFloat(loanAmount) },
    { name: "Total Int.", value: parseFloat(totalInterest) },
  ];

  const barData = {
    labels: Array.from({ length: loanTenure }, (_, i) => 2025 + i),
    datasets: [
      {
        label: "Principal",
        backgroundColor: "#4CAF50",
        data: Array.from({ length: loanTenure }, () => Math.random() * 200000),
      },
      {
        label: "Interest",
        backgroundColor: "#FF9800",
        data: Array.from({ length: loanTenure }, () => Math.random() * 150000),
      },
    ],
  };

  return (
    <div className={styles.container}>
      <div className={styles.mainContent}>
        {/* Left Side - EMI Calculator */}
        <div className={styles.calculator}>
          <h2 className={styles.title}>EMI Calculator</h2>
          <div className={styles.inputGroup}>
            <label>Loan Amount (₹)</label>
            <input
              type="number"
              value={loanAmount}
              onChange={(e) => setLoanAmount(parseFloat(e.target.value) || 0)}
              className={styles.input}
            />
          </div>
          <div className={styles.inputGroup}>
            <label>Interest Rate (%)</label>
            <input
              type="number"
              value={interestRate}
              onChange={(e) => setInterestRate(parseFloat(e.target.value) || 0)}
              className={styles.input}
            />
          </div>
          <div className={styles.inputGroup}>
            <label>Loan Tenure (Years)</label>
            <input
              type="number"
              value={loanTenure}
              onChange={(e) => setLoanTenure(parseFloat(e.target.value) || 0)}
              className={styles.input}
            />
          </div>
          <Button onClick={calculateEMI} text="Calculate Emi" />

          <div className={styles.resultContainer}>
            <p>
              <strong>Loan EMI</strong>
              <span>₹{emi}</span>
            </p>
            <p>
              <strong>Total Interest Payable</strong>
              <span>₹{totalInterest}</span>
            </p>
            <p>
              <strong>Total Payment (Principal + Interest)</strong>
              <span>₹{totalPayment}</span>
            </p>
          </div>
        </div>

        {/* Right Side - Charts */}
        <div className={styles.chartsContainer}>
          <div className={styles.chartBox}>
            <h3 className={styles.title}>EMI Payment Schedule</h3>
            <Bar data={barData} />
          </div>
          <div className={styles.chartBox}>
            <h3 className={styles.title}>Break-up of Total Payment</h3>
            <PieChart width={350} height={300}>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ percent }) => ` (${(percent * 100).toFixed(1)}%)`}
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <RechartsTooltip />
              <RechartsLegend
                layout="horizontal"
                align="center"
                verticalAlign="bottom"
              />
            </PieChart>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmiCalculator;
