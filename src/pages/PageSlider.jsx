import React, { useState, Suspense } from "react";
import { toast } from "react-toastify";
import styles from "../Styles/PageSlider.module.css";

const File = React.lazy(() => import("./File"));
const GuaranteePage = React.lazy(() => import("./GuaranteePage"));

export const PageSlider = () => {
  const [activePage, setActivePage] = useState("file");

  const handleTogglePage = () => {
    setActivePage(activePage === "file" ? "guarantee" : "file");
  };

  return (
    <div className={styles.container}>
      <Suspense fallback={<div>Loading...</div>}>
        {activePage === "file" ? <File /> : <GuaranteePage />}
      </Suspense>

      <button onClick={handleTogglePage} className={styles.toggleButton}>
        {activePage === "file" ? " Guarantee" : " User"}
      </button>
    </div>
  );
};
