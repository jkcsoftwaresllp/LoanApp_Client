import styles from "./style/adminMenu.module.css";
import {
  AnalyticIcon,
  DashboardIcon,
  OppIcon,
  UsersIcon,
  InvestorIcon,
} from "../../common/assets";
import { useNavigate } from "react-router-dom";

const AdminMenu = () => {
  const navigate = useNavigate();
  return (
    <div id={styles.navbody}>
      <form action="">
        <ul className={styles.ul}>
          <input
            name="rad"
            className={styles.radio}
            id="choose1"
            type="radio"
          />
          <label htmlFor="choose1">
            <li
              className={styles.li}
              onClick={() => navigate("/admin/customer")}
            >
              <UsersIcon className={styles.svg} />
            </li>
          </label>
          <input
            name="rad"
            className={styles.radio}
            id="choose2"
            type="radio"
          />
          <label htmlFor="choose2">
            <li
              className={styles.li}
              onClick={() => navigate("/admin/investor")}
            >
              <InvestorIcon className={styles.svg} />
            </li>
          </label>
          <input
            className={styles.radio}
            name="rad"
            defaultChecked
            id="choose3"
            type="radio"
          />
          <label htmlFor="choose3">
            <li
              className={styles.li}
              onClick={() => navigate("/admin/dashboard")}
            >
              <DashboardIcon className={styles.svg} />
            </li>
          </label>

          <input
            className={styles.radio}
            name="rad"
            id="choose4"
            type="radio"
          />
          <label htmlFor="choose4">
            <li className={styles.li} onClick={() => navigate("/admin/report")}>
              <AnalyticIcon className={styles.svg} />
            </li>
          </label>
          <input
            className={styles.radio}
            name="rad"
            id="choose5"
            type="radio"
          />
          <label htmlFor="choose5">
            <li className={styles.li} onClick={() => navigate("/admin/loan")}>
              <OppIcon className={styles.svg} />
            </li>
          </label>
        </ul>
      </form>
    </div>
  );
};

export default AdminMenu;
