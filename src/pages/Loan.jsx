import React, { useState } from "react";
import { UserIcon, CurrencyDollarIcon, DocumentIcon, EyeIcon, CheckCircleIcon } from "@heroicons/react/solid";
import styles from "../Styles/Loan.module.css";
import PageSlider from "./PageSlider"; 
import LoanForm from "./LoanForm";
import SubmitLoan from "./SubmitLoan";
import UpdateLoanDetails from "./UpdateLoanDetails";
import useUpload from "../hooks/useUpload";
import LoanDetails from "./LoanDetails";
import Profile from "./Profile";
import LoanList from "./LoanList";

const Loan = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [currentSubStep, setCurrentSubStep] = useState(0);

  const steps = [
    { label: "Contact Details", icon: <UserIcon className="h-6 w-6" /> },
    { label: "Loan Requirements", icon: <CurrencyDollarIcon className="h-6 w-6" /> },
    { label: "Document Upload", icon: <DocumentIcon className="h-6 w-6" /> },
    { label: "Review", icon: <EyeIcon className="h-6 w-6" /> },
    { label: "Submit", icon: <CheckCircleIcon className="h-6 w-6" /> },
  ];

  const handleNext = () => {
    if (currentSubStep === 1) {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
        setCurrentSubStep(0);
      }
    } else {
      setCurrentSubStep(1);
    }
  };

  const handleBack = () => {
    if (currentSubStep === 0) {
      if (currentStep > 0) {
        setCurrentStep(currentStep - 1);
        setCurrentSubStep(1);
      }
    } else {
      setCurrentSubStep(0);
    }
  };

  const renderForms = () => {
    if (currentStep === 0) {
      return (
        <div>
          <h3 className="text-lg font-semibold mb-2"></h3>
          {currentSubStep === 0 ? <Profile /> : <PageSlider/>}
        </div>
      );
    } else if (currentStep === 1) {
      return (
        <div>
          <h3 className="text-lg font-semibold mb-2"></h3>
          {currentSubStep === 0 ? <LoanForm /> :<LoanDetails /> }
        </div>
      );
    } else if (currentStep === 2) {
      return (
        <div>
          <h3 className="text-lg font-semibold mb-2"></h3>
          {currentSubStep === 0 ? <UpdateLoanDetails /> : <LoanDetails />}
        </div>
      );
    }
    else if (currentStep === 3) {
      return (
        <div>
          <h3 className="text-lg font-semibold mb-2"></h3>
          {currentSubStep === 0 ? <LoanList /> : <LoanDetails />}
        </div>
      );
    }
  };

  return (
    <div className={styles.contentWrapper}>
      <div className={styles.stepperWrapper}>
        <div className={styles.stepper}>
          {steps.map((step, index) => (
            <div key={index} className={styles.step}>
              <div
                className={`${styles.stepIcon} ${
                  index <= currentStep ? styles.stepIconActive : styles.stepIconInactive
                }`}
              >
                {step.icon}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`${styles.stepLine} ${
                    index < currentStep ? styles.stepLineActive : styles.stepLineInactive
                  }`}
                ></div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className={styles.formWrapper}>
        {renderForms()}
        <div className={styles.buttonContainer}>
          <button
            type="button"
            className={`${styles.button} ${styles.buttonBack}`}
            onClick={handleBack}
          >
            Back
          </button>
          <button
            type="button"
            className={`${styles.button} ${styles.buttonNext}`}
            onClick={handleNext}
          >
            {currentSubStep === 1 ? "Next" : "Continue"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Loan;
