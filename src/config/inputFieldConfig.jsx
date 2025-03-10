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
        id: "full_name",
        type: "text",
        value: value.full_name || "",
        placeholder: "Enter full name",
        disabled: false,
      },
      {
        label: "Father's / Mother's Name",
        id: "father_or_mother_name",
        type: "text",
        value: value.father_or_mother_name || "",
        placeholder: "Enter parent's name",
        disabled: false,
      },
      {
        label: "Marital Status",
        id: "marital_status",
        type: "select",
        options: ["Single", "Married", "Divorced", "Widowed"],
        value: value.marital_status || "",
        placeholder: "Select marital status",
        disabled: false,
      },
      {
        label: "Current Address",
        id: "current_address",
        type: "text",
        value: value.current_address || "",
        placeholder: "Enter current address",
        disabled: false,
      },
      {
        label: "Permanent Address",
        id: "permanent_address",
        type: "text",
        value: value.permanent_address || "",
        placeholder: "Enter permanent address",
        disabled: false,
      },
      {
        label: "Mobile Number",
        id: "mobile_number",
        type: "text",
        value: value.mobile_number || "",
        placeholder: "Enter mobile number",
        disabled: false,
      },
      {
        label: "Email ID",
        id: "email_id",
        type: "email",
        value: value.email_id || "",
        placeholder: "Enter email",
        disabled: false,
      },
      {
        label: "Educational Qualification",
        id: "educational_qualification",
        type: "text",
        value: value.educational_qualification || "",
        placeholder: "Enter qualification",
        disabled: false,
      },

      // Employment & Income Details
      {
        label: "Employment Type",
        id: "employment_type",
        type: "select",
        options: ["Salaried", "Self-employed"],
        value: value.employment_type || "",
        placeholder: "Select employment type",
        disabled: false,
      },
      {
        label: "Company Name",
        id: "company_name",
        type: "text",
        value: value.company_name || "",
        placeholder: "Enter company name",
        disabled: false,
        hidden: value.employment_type === "Self-employed",
      },
      {
        label: "Company Type",
        id: "company_type",
        type: "select",
        options: ["Private", "Government", "MNC", "Startup"],
        value: value.company_type || "",
        placeholder: "Select company type",
        disabled: false,
        hidden: value.employment_type === "Self-employed",
      },
      {
        label: "Current Job Designation",
        id: "current_job_designation",
        type: "text",
        value: value.current_job_designation || "",
        placeholder: "Enter job designation",
        disabled: false,
        hidden: value.employment_type === "Self-employed",
      },
      {
        label: "Official Email",
        id: "official_email",
        type: "email",
        value: value.official_email || "",
        placeholder: "Enter official email",
        disabled: false,
        hidden: value.employment_type === "Self-employed",
      },
      {
        label: "Business Details",
        id: "business_details",
        type: "text",
        value: value.business_details || "",
        placeholder: "Enter business details",
        disabled: false,
        hidden: value.employment_type === "Salaried",
      },
      {
        label: "Annual Turnover",
        id: "annual_turnover",
        type: "number",
        value: value.annual_turnover || "",
        placeholder: "Enter annual turnover",
        disabled: false,
        hidden: value.employment_type === "Salaried",
      },
      {
        label: "Existing EMI Commitments",
        id: "existing_emi_commitments",
        type: "text",
        value: value.existing_emi_commitments || "",
        placeholder: "Enter existing EMI details or None",
        disabled: false,
      },
      {
        label: "Other Income Sources",
        id: "other_income_sources",
        type: "text",
        value: value.other_income_sources || "",
        placeholder: "Enter other income sources or None",
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
        label: "Bank Name",
        id: "bank_name",
        type: "text",
        value: value.bank_name || "",
        placeholder: "Enter bank name",
        disabled: false,
      },
      {
        label: "Branch",
        id: "branch",
        type: "text",
        value: value.branch || "",
        placeholder: "Enter branch name",
        disabled: false,
      },
      {
        label: "Account Type",
        id: "account_type",
        type: "select",
        options: ["Savings", "Current"],
        value: value.account_type || "",
        placeholder: "Select account type",
        disabled: false,
      },
      {
        label: "Account Number",
        id: "account_number",
        type: "text",
        value: value.account_number || "",
        placeholder: "Enter account number",
        disabled: false,
      },
      {
        label: "Salary Credit Mode",
        id: "salary_credit_mode",
        type: "select",
        options: ["Bank Transfer", "Cheque", "Cash", "Other"],
        value: value.salary_credit_mode || "",
        placeholder: "Select salary credit mode",
        disabled: false,
      },
      {
        label: "Credit Score",
        id: "credit_score",
        type: "number",
        value: value.credit_score || "",
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
