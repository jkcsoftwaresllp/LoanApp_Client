import React, { useState, Suspense } from "react";
import { toast } from "react-toastify";
import styles from "../Styles/PageSlider.module.css";
import { UserIcon, ParentIcon } from "../components/common/assets";
import { Loader } from "../components/common/Loader";
import Btn from "../components/common/Btn";
import UserGuaranteeForm from "../components/forms/UserGuaranteeForm";

const File = React.lazy(() => import("./File"));
const GuaranteePage = React.lazy(() => import("./GuaranteePage"));

const PageSlider = () => {
  const [activePage, setActivePage] = useState("file");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    mobileNo: "",
    parentName: "",
    bankAccountNo: "",
    panNo: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleTogglePage = () => {
    setActivePage(activePage === "file" ? "guarantee" : "file");
    setFormData({
      name: "",
      address: "",
      mobileNo: "",
      parentName: "",
      bankAccountNo: "",
      panNo: "",
    });
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

      <Btn
        label={activePage === "file" ? "Guarantee" : "User"}
        onClick={handleTogglePage}
        icon={getIcon()}
      />

      <UserGuaranteeForm
        formData={formData}
        handleInputChange={handleInputChange}
        activePage={activePage}
      />
    </div>
  );
};

export default PageSlider;
