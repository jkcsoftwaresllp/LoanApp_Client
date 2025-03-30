import React from "react";
import style from "./style/Btn.module.css";

export const Button = ({ type, text, onClick, className, disabled }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={style.btn}
      disabled={disabled}
    >
      {text}
    </button>
  );
};
