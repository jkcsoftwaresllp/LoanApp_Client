import React from "react";

const TextInput = ({ config, onChange }) => {
  const { label, id, type, value, placeholder, disabled, hidden } = config;

  return (
    !hidden && (
      <div className="mb-4">
        <label htmlFor={id} className="block text-gray-700 font-bold mb-2">
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
          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
        />
      </div>
    )
  );
};

export default TextInput;
