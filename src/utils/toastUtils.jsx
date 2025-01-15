// utils/toastUtils.js
import { toast } from "react-toastify";

// Show Toast notification (success/error)
export const showToast = (type, message) => {
  if (type === "success") {
    toast.success(message);
  } else {
    toast.error(message);
  }
};
