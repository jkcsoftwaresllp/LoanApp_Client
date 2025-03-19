export const calculateEMI = (
  loanAmount,
  interestRate,
  loanTenure,
  tenureType
) => {
  const principal = parseFloat(loanAmount);
  const rate = parseFloat(interestRate) / 12 / 100;
  const tenure =
    tenureType === "years"
      ? parseFloat(loanTenure) * 12
      : parseFloat(loanTenure);

  if (rate === 0) {
    return {
      emi: (principal / tenure).toFixed(2),
      totalInterest: "0.00",
      totalPayment: principal.toFixed(2),
    };
  }

  const emiValue =
    (principal * rate * Math.pow(1 + rate, tenure)) /
    (Math.pow(1 + rate, tenure) - 1);
  const totalPay = emiValue * tenure;
  const totalInt = totalPay - principal;

  return {
    emi: emiValue.toFixed(2),
    totalInterest: totalInt.toFixed(2),
    totalPayment: totalPay.toFixed(2),
  };
};

export const generateBarLabels = (loanTenure, tenureType) => {
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

export const generateBarData = (
  loanAmount,
  interestRate,
  loanTenure,
  tenureType
) => {
  const labels = generateBarLabels(loanTenure, tenureType);
  const tenureInMonths = tenureType === "years" ? loanTenure * 12 : loanTenure;

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
