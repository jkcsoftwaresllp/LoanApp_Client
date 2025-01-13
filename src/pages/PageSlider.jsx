import { useState } from "react";
import FileUploadPage from "./FileUploadPage"; // Import FileUploadPage
import Guarantee from "./Guarantee"; // Import Guarantee Page

const PageSlider = () => {
  const [activePage, setActivePage] = useState("fileUpload"); // State to manage active page

  const handleTogglePage = () => {
    setActivePage(activePage === "fileUpload" ? "guarantee" : "fileUpload");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 relative">
      {/* Conditionally render content based on activePage */}
      {activePage === "fileUpload" ? <FileUploadPage /> : <Guarantee />}

      {/* Button to switch between pages */}
      <button
        onClick={handleTogglePage}
        className="absolute bottom-5 p-3 bg-blue-500 text-white rounded-md"
      >
        {activePage === "fileUpload" ? "Go to Guarantee Upload" : "Go to File Upload"}
      </button>
    </div>
  );
};

export default PageSlider;
