import { useState } from "react";
import loanService from "../services/loanService";

const LoanForm = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    amount: 0,
    repayment_schedule: "",
    interest_rate: 0,
  });

  const handleNext = async () => {
    if (step === 3) {
      // Submit loan draft
      await loanService.saveDraft(formData);
    }
    setStep(step + 1);
  };

  const handlePrevious = () => setStep(step - 1);

  return (
    <div>
      {step === 1 && (
        <div>
          <h2>Step 1: Loan Amount</h2>
          <input
            type="number"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          />
        </div>
      )}
      {step === 2 && (
        <div>
          <h2>Step 2: Repayment Schedule</h2>
          <input
            type="text"
            value={formData.repayment_schedule}
            onChange={(e) =>
              setFormData({ ...formData, repayment_schedule: e.target.value })
            }
          />
        </div>
      )}
      {step === 3 && (
        <div>
          <h2>Step 3: Interest Rate</h2>
          <input
            type="number"
            value={formData.interest_rate}
            onChange={(e) =>
              setFormData({ ...formData, interest_rate: e.target.value })
            }
          />
        </div>
      )}
      <button disabled={step === 1} onClick={handlePrevious}>
        Previous
      </button>
      <button onClick={handleNext}>{step === 3 ? "Submit" : "Next"}</button>
    </div>
  );
};

export default LoanForm;
