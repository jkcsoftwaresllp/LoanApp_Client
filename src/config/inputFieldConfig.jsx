export const inputFieldConfig = (isLogin, isProfileUpdate = false) => {
    if (isLogin) {
      return [
        {
          label: "Mobile Number",
          id: "mobileNumber",
          type: "text",
          placeholder: "Enter your mobile number",
          disabled: false,
        },
        {
          label: "Enter OTP",
          id: "otp",
          type: "text",
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
          placeholder: "Enter your full name",
          disabled: false,
        },
        {
          label: "Address",
          id: "address",
          type: "text",
          placeholder: "Enter your address",
          disabled: false,
        },
        {
          label: "Email",
          id: "email",
          type: "email",
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
        placeholder: "Enter your mobile number",
        disabled: false,
      },
      {
        label: "Email",
        id: "email",
        type: "email",
        placeholder: "Enter your email",
        disabled: false,
      },
      {
        label: "Enter OTP",
        id: "otp",
        type: "text",
        placeholder: "Enter the OTP sent to your mobile",
        disabled: false,
        hidden: true, // Initially hidden for registration until OTP is generated
      },
    ];
  };
  