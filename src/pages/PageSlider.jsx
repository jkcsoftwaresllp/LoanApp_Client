import React, { useState, Suspense } from "react";
import { toast } from "react-toastify";
import styles from "../Styles/PageSlider.module.css";
import { UserIcon, ParentIcon } from "../components/common/assets"; // Import icons
import { Loader } from "../components/common/Loader";
import Btn from "../components/common/Btn";

const File = React.lazy(() => import("./File"));
const GuaranteePage = React.lazy(() => import("./GuaranteePage"));

const PageSlider = () => {
  const [activePage, setActivePage] = useState("file");

  const handleTogglePage = () => {
    setActivePage(activePage === "file" ? "guarantee" : "file");
  };

  const getIcon = () => {
    return activePage === "file" ? <ParentIcon /> : <UserIcon />;
  };

  return (
    <div className={styles.container}>
      <Suspense
        fallback={
          <div className={styles.center}>
            <Loader />
          </div>
        }
      >
        {activePage === "file" ? <File /> : <GuaranteePage />}
      </Suspense>

      {/* Pass the icon dynamically */}
      <Btn
        label={activePage === "file" ? "Guarantee" : "User"}
        onClick={handleTogglePage}
        icon={getIcon()} // This will pass the icon to the Btn component
      />
    </div>
  );
};

export default PageSlider;
