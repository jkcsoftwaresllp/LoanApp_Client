export const inputFieldConfig = (type, isLogin = false, isProfileUpdate = false, value = {}) => {
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
        label: "Enter OTP",
        id: "otp",
        type: "text",
        value: value.otp || "",
        placeholder: "Enter the OTP sent to your mobile",
        disabled: false,
        hidden: true, // Initially hidden for login until OTP is generated
      },
    ];
  }

  if (isProfileUpdate) {
    return [
      {
        label: "Name",
        id: "name",
        type: "text",
        value: value.name || "",
        placeholder: "Enter your full name",
        disabled: false,
      },
      {
        label: "Address",
        id: "address",
        type: "text",
        value: value.address || "",
        placeholder: "Enter your address",
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
    ];
  }

  if (type === "file") {
    return {
      label: "Upload Document",
      id: "fileInput",
      type: "file",
      onChange: null, // Function to be passed on file input change
      required: true,
      className: "hidden",
      ariaLabel: "File Upload",
    };
  }

  // Default registration flow
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
      label: "Enter OTP",
      id: "otp",
      type: "text",
      value: value.otp || "",
      placeholder: "Enter the OTP sent to your mobile",
      disabled: false,
      hidden: true, // Initially hidden for registration until OTP is generated
    },
  ];
};
