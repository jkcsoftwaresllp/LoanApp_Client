import React from "react";
import style from "./style/Btn.module.css";

export const IconBtn = ({ icon, onClick, className, type = "button" }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`${style.IconBtn} ${className || ""}`}
    >
      {icon}
    </button>
  );
};
