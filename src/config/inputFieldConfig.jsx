export const inputFieldConfig = (
  isLogin = false,
  isProfileUpdate = false,
  value = {}
) => {
  if (isLogin) {
    return [
      {
        label: "Mobile Number",
        id: "mobileNumber",
        type: "text",
        value: value.mobileNumber || "",
        placeholder: "Enter your mobile number",
        disabled: false,
      },
      {
        label: "Password",
        id: "password",
        type: "password",
        value: value.password || "",
        placeholder: "Enter your password",
        disabled: false,
      },
      {
        label: "Enter OTP",
        id: "otp",
        type: "text",
        value: value.otp || "",
        placeholder: "Enter the OTP sent to your mobile",
        disabled: false,
        hidden: true,
      },
    ];
  }

  if (isProfileUpdate) {
    return [
      // Personal Information
      {
        label: "Full Name (as per PAN)",
        id: "name",
        type: "text",
        value: value.name || "",
        placeholder: "Enter full name",
        disabled: false,
      },
      {
        label: "Father’s / Mother’s Name",
        id: "parentName",
        type: "text",
        value: value.parentName || "",
        placeholder: "Enter parent's name",
        disabled: false,
      },
      {
        label: "Marital Status",
        id: "maritalStatus",
        type: "select",
        options: ["Single", "Married", "Divorced", "Widowed"],
        value: value.maritalStatus || "",
        placeholder: "Select marital status",
        disabled: false,
      },
      {
        label: "Current Address",
        id: "currentAddress",
        type: "text",
        value: value.currentAddress || "",
        placeholder: "Enter current address",
        disabled: false,
      },
      {
        label: "Permanent Address",
        id: "permanentAddress",
        type: "text",
        value: value.permanentAddress || "",
        placeholder: "Enter permanent address",
        disabled: false,
      },
      {
        label: "Mobile Number",
        id: "mobileNumber",
        type: "text",
        value: value.mobileNumber || "",
        placeholder: "Enter mobile number",
        disabled: false,
      },
      {
        label: "Email ID",
        id: "email",
        type: "email",
        value: value.email || "",
        placeholder: "Enter email",
        disabled: false,
      },
      {
        label: "Educational Qualification",
        id: "education",
        type: "text",
        value: value.education || "",
        placeholder: "Enter qualification",
        disabled: false,
      },

      // Employment & Income Details
      {
        label: "Employment Type",
        id: "employmentType",
        type: "select",
        options: ["Salaried", "Self-employed"],
        value: value.employmentType || "",
        placeholder: "Select employment type",
        disabled: false,
      },
      {
        label: "Company Name",
        id: "companyName",
        type: "text",
        value: value.companyName || "",
        placeholder: "Enter company name",
        disabled: false,
      },
      {
        label: "Current Job Designation",
        id: "jobTitle",
        type: "text",
        value: value.jobTitle || "",
        placeholder: "Enter job title",
        disabled: false,
      },
      {
        label: "Annual Income",
        id: "annualIncome",
        type: "number",
        value: value.annualIncome || "",
        placeholder: "Enter annual income",
        disabled: false,
      },

      // Banking & Financial Information
      {
        label: "Bank Name & Branch",
        id: "bankName",
        type: "text",
        value: value.bankName || "",
        placeholder: "Enter bank name & branch",
        disabled: false,
      },
      {
        label: "Account Type",
        id: "accountType",
        type: "select",
        options: ["Savings", "Current"],
        value: value.accountType || "",
        placeholder: "Select account type",
        disabled: false,
      },
      {
        label: "Account Number",
        id: "accountNumber",
        type: "text",
        value: value.accountNumber || "",
        placeholder: "Enter account number",
        disabled: false,
      },
      {
        label: "Credit Score",
        id: "creditScore",
        type: "number",
        value: value.creditScore || "",
        placeholder: "Enter credit score",
        disabled: false,
      },

      // KYC & Documentation (File Upload Fields)
      {
        label: "Aadhaar Number",
        id: "aadhaar",
        type: "text",
        value: value.aadhaar || "",
        placeholder: "Enter Aadhaar number",
        disabled: false,
      },
      {
        label: "PAN Number",
        id: "pan",
        type: "text",
        value: value.pan || "",
        placeholder: "Enter PAN number",
        disabled: false,
      },
      {
        label: "Voter ID / Driving License / Passport",
        id: "idProof",
        type: "file",
        value: "",
        placeholder: "Upload ID proof",
        disabled: false,
      },
      {
        label: "Latest Salary Slips / ITR / Form 16",
        id: "incomeProof",
        type: "file",
        value: "",
        placeholder: "Upload income proof",
        disabled: false,
      },
      {
        label: "Bank Statements (Last 6 Months)",
        id: "bankStatements",
        type: "file",
        value: "",
        placeholder: "Upload bank statements",
        disabled: false,
      },
    ];
  }

  return [
    {
      label: "Mobile Number",
      id: "mobileNumber",
      type: "text",
      value: value.mobileNumber || "",
      placeholder: "Enter your mobile number",
      disabled: false,
    },
    {
      label: "Email",
      id: "email",
      type: "email",
      value: value.email || "",
      placeholder: "Enter your email",
      disabled: false,
    },
    {
      label: "Password",
      id: "password",
      type: "password",
      value: value.password || "",
      placeholder: "Create a password",
      disabled: false,
    },
    {
      label: "Enter OTP",
      id: "otp",
      type: "text",
      value: value.otp || "",
      placeholder: "Enter the OTP sent to your mobile",
      disabled: false,
      hidden: true,
    },
  ];
};
