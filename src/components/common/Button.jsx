import React from "react";

const Button = ({ type, text, onClick, className }) => {
  return (
    <button
      type={type}
      onClick={onClick} 
      className={`w-full py-2 px-4 rounded focus:outline-none ${className}`}
    >
      {text}
    </button>
  );
};

export default Button;
