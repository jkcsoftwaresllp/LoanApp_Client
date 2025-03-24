import { Outlet } from "react-router-dom";
import AdminMenu from "../jsx/adminMenu";
import styles from "./style/adminLayout.module.css";

const AdminLayout = () => {
  return (
    <div className={styles.layoutContainer}>
      <div className={styles.content}>
        <Outlet />
      </div>
      <div className={styles.menu}>
        <AdminMenu />
      </div>
    </div>
  );
};

export default AdminLayout;
