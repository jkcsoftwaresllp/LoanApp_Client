import React, { useState } from "react";
import { Bar } from "react-chartjs-2";
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

const COLORS = ["#4CAF50", "#FF9800"];

const EmiCalculator = () => {
  const [loanAmount, setLoanAmount] = useState(25000);
  const [interestRate, setInterestRate] = useState(8);
  const [loanTenure, setLoanTenure] = useState(20);
  const [tenureType, setTenureType] = useState("years");
  const [emi, setEmi] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);

  const calculateEMI = () => {
    const principal = parseFloat(loanAmount);
    const rate = parseFloat(interestRate) / 12 / 100;
    const tenure =
      tenureType === "years"
        ? parseFloat(loanTenure) * 12
        : parseFloat(loanTenure);

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

  const generateBarLabels = () => {
    const labels = [];
    const today = new Date();
    for (let i = 0; i < loanTenure; i++) {
      const newDate = new Date(today);
      if (tenureType === "years") {
        newDate.setFullYear(today.getFullYear() + i);
        labels.push(newDate.getFullYear());
      } else {
        newDate.setMonth(today.getMonth() + i);
        labels.push(
          `${newDate.toLocaleString("default", {
            month: "short",
          })} ${newDate.getFullYear()}`
        );
      }
    }
    return labels;
  };

  const generateBarData = () => {
    const labels = generateBarLabels();
    const tenureInMonths =
      tenureType === "years" ? loanTenure * 12 : loanTenure;

    let remainingBalance = loanAmount;
    const monthlyRate = interestRate / 12 / 100;
    const emiValue =
      (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, tenureInMonths)) /
      (Math.pow(1 + monthlyRate, tenureInMonths) - 1);

    const principalData = [];
    const interestData = [];

    for (let i = 0; i < tenureInMonths; i++) {
      const interestPortion = remainingBalance * monthlyRate;
      const principalPortion = emiValue - interestPortion;

      remainingBalance -= principalPortion;

      principalData.push(principalPortion.toFixed(2));
      interestData.push(interestPortion.toFixed(2));
    }

    return {
      labels,
      datasets: [
        {
          label: "Principal",
          backgroundColor: "#4CAF50",
          data: principalData,
        },
        {
          label: "Interest",
          backgroundColor: "#FF9800",
          data: interestData,
        },
      ],
    };
  };

  const barData = generateBarData();

  return (
    <div className={styles.container}>
      <div className={styles.mainContent}>
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
            <label>Loan Tenure</label>
            <div className={styles.inputGroupTenure}>
              <input
                type="number"
                value={loanTenure}
                onChange={(e) => setLoanTenure(parseFloat(e.target.value) || 0)}
                className={styles.input}
              />

              <button
                className={`px-4 py-2 rounded-lg ${
                  tenureType === "years"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200"
                }`}
                onClick={() => setTenureType("years")}
              >
                Years
              </button>
              <button
                className={`px-4 py-2 rounded-lg ${
                  tenureType === "months"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200"
                }`}
                onClick={() => setTenureType("months")}
              >
                Months
              </button>
            </div>
          </div>
          <Button onClick={calculateEMI} text="Calculate EMI" />
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
        <div className={styles.chartsContainer}>
          <div className={`${styles.chartBox} ${styles.hideOnSmallScreen}`}>
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
                className={styles.hideLegendOnSmallScreen}
              />
            </PieChart>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmiCalculator;
