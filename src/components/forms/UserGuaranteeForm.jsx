import React from "react";
import styles from "../../Styles/PageSlider.module.css";

const UserGuaranteeForm = ({ formData, handleInputChange, activePage }) => {
  return (
    <div className={styles.formSection}>
      <div className={styles.inputField}>
        <label className={styles.llabel}>Name</label>
        <div className={styles.inputWrapper}>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={(e) => {
              const value = e.target.value;
              if (value === "" || /^[A-Za-z\s]+$/.test(value)) {
                handleInputChange(e);
              }
            }}
            className={styles.input}
            required
          />
        </div>
      </div>
      <div className={styles.inputField}>
        <label className={styles.llabel}>Parent Name</label>
        <div className={styles.inputWrapper}>
          <input
            type="text"
            name="parentName"
            value={formData.parentName}
            onChange={(e) => {
              const value = e.target.value;
              if (value === "" || /^[A-Za-z\s]+$/.test(value)) {
                handleInputChange(e);
              }
            }}
            className={styles.input}
            required
          />
        </div>
      </div>

      <div className={styles.inputField}>
        <label className={styles.llabel}>Address</label>
        <div className={styles.inputWrapper}>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            className={styles.input}
            required
          />
        </div>
      </div>

      <div className={styles.inputField}>
        <label className={styles.llabel}>Mobile Number</label>
        <div className={styles.inputWrapper}>
          <input
            type="tel"
            name="mobileNo"
            value={formData.mobileNo}
            onChange={(e) => {
              const value = e.target.value;
              if (value === "" || /^[0-9]+$/.test(value)) {
                handleInputChange(e);
              }
            }}
            className={styles.input}
            maxLength={10}
            required
          />
        </div>
      </div>

      {activePage === "guarantee" && (
        <>
          <div className={styles.inputField}>
            <label className={styles.llabel}>Bank Account Number</label>
            <div className={styles.inputWrapper}>
              <input
                type="text"
                name="bankAccountNo"
                value={formData.bankAccountNo}
                onChange={handleInputChange}
                className={styles.input}
                required
              />
            </div>
          </div>
          <div className={styles.inputField}>
            <label className={styles.llabel}>PAN Number</label>
            <div className={styles.inputWrapper}>
              <input
                type="text"
                name="panNo"
                value={formData.panNo}
                onChange={handleInputChange}
                className={styles.input}
                pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}"
                required
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UserGuaranteeForm;
