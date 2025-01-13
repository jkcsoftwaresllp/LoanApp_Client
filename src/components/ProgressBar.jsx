// src/components/ProgressBar.js
import React from "react";

const ProgressBar = ({ step }) => {
  const progress = (step / 3) * 100; // Assuming there are 3 steps in the form

  return (
    <div className="mb-6">
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className="bg-blue-600 h-2.5 rounded-full"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <div className="flex justify-between mt-2">
        <span>Step 1</span>
        <span>Step 2</span>
        <span>Step 3</span>
      </div>
    </div>
  );
};

export default ProgressBar;
