import React, { useState, useEffect } from "react";
import styles from "./style/emi.module.css";

const EmiCalculator = () => {
  const [loanAmount, setLoanAmount] = useState(100000);
  const [loanRangeStep, setLoanRangeStep] = useState(100000);
  const [min, setMin] = useState(100000);
  const [max, setMax] = useState(1000000);
  const [tenureType, setTenureType] = useState(2);
  const [maxTenure, setMaxTenure] = useState(30);
  const [interestType, setInterestType] = useState(1);
  const [interest, setInterest] = useState(12);
  const [tenure, setTenure] = useState(1);
  const [emi, setEmi] = useState(undefined);
  const [totalInterest, setTotalInterest] = useState(undefined);
  const [tenureInMonths, setTenureInMonths] = useState(undefined);

  useEffect(() => {
    calculateEMI();
  }, [loanAmount, tenure, interest, tenureType, interestType]);

  const calculateEMI = () => {
    let term = tenureType === 2 ? tenure * 12 : tenure;
    setTenureInMonths(term);
    let calculatedEmi, calculatedTotalInterest;

    if (interestType === 1) {
      let rate = tenureType === 3 ? interest / 36500 : interest / 1200;
      let top = Math.pow(1 + rate, term);
      let bottom = top - 1;
      let ratio = top / bottom;
      let principal = (loanAmount / term).toFixed(2);
      calculatedEmi = (loanAmount * rate * ratio).toFixed(2);
      calculatedTotalInterest = ((calculatedEmi - principal) * term).toFixed(2);
    } else {
      calculatedTotalInterest = (
        loanAmount *
        interest *
        (tenureType === 3 ? 1 / 36500 : 1 / 1200) *
        term
      ).toFixed(2);
      calculatedEmi = (
        (parseFloat(loanAmount) + parseFloat(calculatedTotalInterest)) /
        term
      ).toFixed(2);
    }
    setEmi(calculatedEmi);
    setTotalInterest(calculatedTotalInterest);
  };

  return (
    <div className="font-sans bg-gray-900 min-h-screen p-4 text-white">
      <div>
        <p className="font-bold text-xl">{tenureType !== 3 ? "EMI" : "EDI"}</p>
        <p className="text-3xl font-black text-green-400">
          ₹ {emi}{" "}
          <span className="text-base">
            {tenureType !== 3 ? "per month" : "per day"}
          </span>
        </p>
        <p className="text-sm">
          for {tenureInMonths} {tenureInMonths === 1 ? "month" : "months"}
        </p>
      </div>
      <div>
        <p className="font-bold text-xl">Total Interest that you'll pay</p>
        <p className="text-3xl font-black text-green-400">₹ {totalInterest}</p>
      </div>
      <div className="bg-gray-200 rounded shadow py-4 px-2 mb-4 text-black">
        <p className="text-center uppercase text-xs font-black">Loan Amount</p>
        <input
          type="number"
          className="w-full text-2xl font-bold text-center"
          value={loanAmount}
          onChange={(e) => setLoanAmount(Number(e.target.value))}
        />
        <input
          type="range"
          className={styles.rangeSlider}
          min={min}
          max={max}
          step={loanRangeStep}
          value={loanAmount}
          onChange={(e) => setLoanAmount(Number(e.target.value))}
        />
      </div>
    </div>
  );
};

export default EmiCalculator;
