import React from "react";
import styles from "./style/Cookie.module.css";
import { CookieIcon } from "./assets";

export const Cookie = () => {
  return (
    <div className={styles.card}>
      <div className={styles.cookieIconContainer}>
        <CookieIcon />
      </div>
      <p className={styles.cookieHeading}>We use cookies.</p>
      <p className={styles.cookieDescription}>
        We use cookies to ensure that we give you the best experience on our
        website. <br />
        <a href="#">Read cookies policies</a>.
      </p>

      <div className={styles.buttonContainer}>
        <button className={styles.acceptButton}>Allow</button>
        {/* <button className={styles.declineButton}>Decline</button> */}
      </div>
    </div>
  );
};
