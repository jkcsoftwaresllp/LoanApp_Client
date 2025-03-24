import styles from "./style/card.module.css";

export const Card = ({ children }) => {
  return <div className={styles.card}>{children}</div>;
};
