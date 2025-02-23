import styles from "./style/menuBar.module.css";
import {
  PortfolioIcon,
  DashboardIcon,
  FeedbackIcon,
  OppIcon,
} from "../../common/assets";
import { useNavigate } from "react-router-dom";

const MenuBar = () => {
  const navigate = useNavigate();
  return (
    <div id={styles.navbody}>
      <form action="#">
        <ul className={styles.ul}>
          <input
            defaultChecked
            name="rad"
            className={styles.radio}
            id="choose1"
            type="radio"
          />
          <label htmlFor="choose1">
            <li className={styles.li} onClick={() => navigate("/dashboard")}>
              <DashboardIcon className={styles.svg} />
            </li>
          </label>
          <input
            className={styles.radio}
            name="rad"
            id="choose2"
            type="radio"
          />
          <label htmlFor="choose2">
            <li className={styles.li} onClick={() => navigate("/portfolio")}>
              <PortfolioIcon className={styles.svg} />
            </li>
          </label>
          <input
            className={styles.radio}
            name="rad"
            id="choose3"
            type="radio"
          />
          <label htmlFor="choose3">
            <li
              className={styles.li}
              onClick={() => navigate("/make-investment")}
            >
              <OppIcon className={styles.svg} />
            </li>
          </label>
          <input
            className={styles.radio}
            name="rad"
            id="choose4"
            type="radio"
          />
          <label htmlFor="choose4">
            <li className={styles.li} onClick={() => navigate("/feedback")}>
              <FeedbackIcon className={styles.svg} />
            </li>
          </label>
        </ul>
      </form>
    </div>
  );
};

export default MenuBar;
