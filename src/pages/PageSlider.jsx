import React, { useState, Suspense } from "react";
import { toast } from "react-toastify";
import styles from "../Styles/PageSlider.module.css"; 

const File = React.lazy(() => import("./File"));
const GuaranteePage = React.lazy(() => import("./GuaranteePage"));

const PageSlider = () => {
  const [activePage, setActivePage] = useState("file");
  
  const handleTogglePage = () => {
    setActivePage(activePage === "file" ? "guarantee" : "file");
  };

  return (
    <div className={styles.container}>
      <Suspense fallback={<div>Loading...</div>}>
        {activePage === "file" ? (
          <File />
        ) : (
          <GuaranteePage />
        )}
      </Suspense>

      <button
        onClick={handleTogglePage}
        className={styles.toggleButton}
      >
        {activePage === "file"
          ? "Go to Guarantee Upload"
          : "Go to File Upload"}
      </button>
    </div>
  );
};

export default PageSlider;
