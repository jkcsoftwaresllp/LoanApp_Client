import React, { useState } from "react";

export const Select = ({ label, children, onChange }) => {
  const [selected, setSelected] = useState("");

  const handleChange = (e) => {
    setSelected(e.target.value);
    onChange && onChange(e.target.value);
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <select
        value={selected}
        onChange={handleChange}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
      >
        <option value="" disabled>
          Select an option
        </option>
        {children}
      </select>
    </div>
  );
};

export const SelectItem = ({ value, children }) => (
  <option value={value}>{children}</option>
);
