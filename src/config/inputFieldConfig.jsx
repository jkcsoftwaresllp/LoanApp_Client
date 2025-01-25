export const inputFieldConfig = (isLogin = false, isProfileUpdate = false, value = {}) => {
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
