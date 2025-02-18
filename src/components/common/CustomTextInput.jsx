import React from "react";
import style from "./style/textinput.module.css";

export const CustomTextInput = ({ config, onChange }) => {
  const { label, id, type, value, placeholder, disabled, hidden } = config;

  return (
    !hidden && (
      <div className={style.customTextInput}>
        <label htmlFor={id} className={style.input}>
          {label}
        </label>
        <input
          id={id}
          name={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={style.inputForm}
        />
      </div>
    )
  );
};
