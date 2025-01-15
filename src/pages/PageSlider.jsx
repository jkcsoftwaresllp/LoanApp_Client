import React from "react";
import { useState, Suspense } from "react";
import { toast } from "react-toastify";

const File = React.lazy(() => import("./File"));
const GuaranteePage = React.lazy(() => import("./GuaranteePage"));

const PageSlider = () => {
  const [activePage, setActivePage] = useState("file"); 
  const handleTogglePage = () => {
    setActivePage(activePage === "file" ? "guarantee" : "file");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 relative">
     
      <Suspense fallback={<div>Loading...</div>}>
       
        {activePage === "file" ? (
          <File />
        ) : (
          <GuaranteePage />
        )}
      </Suspense>

     
      <button
        onClick={handleTogglePage}
        className="absolute bottom-5 p-3 bg-blue-500 text-white rounded-md"
      >
        {activePage === "file"
          ? "Go to Guarantee Upload"
          : "Go to File Upload"}
      </button>
    </div>
  );
};

export default PageSlider;
