import React from "react";

const Button = ({ type, text }) => {
  return (
    <button
      type={type}
      className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none"
    >
      {text}
    </button>
  );
};

export default Button;
