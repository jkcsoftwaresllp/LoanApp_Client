import React, { useEffect } from "react";
import styles from "../../Styles/PageSlider.module.css";
import axios from "axios";
import { API_BASE_URL } from "../../config";
import { Button } from "../common/Button";

const UserGuaranteeForm = ({ formData, handleInputChange, activePage }) => {
  useEffect(() => {
    if (activePage === "user") {
      fetchUserProfile();
    }
  }, [activePage]);

  const fetchUserProfile = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await axios.get(`${API_BASE_URL}auth/profile`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (response.data && response.data.profile) {
        // Pre-fill user data
        const userData = {
          name: response.data.profile.name,
          parentName: response.data.profile.father_or_mother_name,
          address: response.data.profile.address,
          mobileNo: response.data.profile.phone,
          panNo: response.data.profile.pan_number,
          bankAccountNo: response.data.profile.account_number,
        };

        // Update form data with user details
        Object.entries(userData).forEach(([key, value]) => {
          handleInputChange({ target: { name: key, value: value || "" } });
        });
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  const renderUserFields = () => (
    <>
      <div className={styles.inputField}>
        <label className={styles.llabel}>Name (as per PAN)</label>
        <div className={styles.inputWrapper}>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className={styles.input}
            disabled={activePage === "user"}
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
            onChange={handleInputChange}
            className={styles.input}
            disabled={activePage === "user"}
            required
          />
        </div>
      </div>

      <div className={styles.inputField}>
        <label className={styles.llabel}>Address</label>
        <div className={styles.inputWrapper}>
          <textarea
            name={activePage === "user" ? "address" : "guarantorAddress"}
            value={
              activePage === "user"
                ? formData.address
                : formData.guarantorAddress
            }
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
            name={activePage === "user" ? "mobileNo" : "guarantorMobileNo"}
            value={
              activePage === "user"
                ? formData.mobileNo
                : formData.guarantorMobileNo
            }
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

      <div className={styles.inputField}>
        <label className={styles.llabel}>Bank Account Number</label>
        <div className={styles.inputWrapper}>
          <input
            type="text"
            name={
              activePage === "user" ? "bankAccountNo" : "guarantorBankAccountNo"
            }
            value={
              activePage === "user"
                ? formData.bankAccountNo
                : formData.guarantorBankAccountNo
            }
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
            name={activePage === "user" ? "panNo" : "guarantorPanNo"}
            value={
              activePage === "user" ? formData.panNo : formData.guarantorPanNo
            }
            onChange={handleInputChange}
            className={styles.input}
            pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}"
            required
          />
        </div>
      </div>
    </>
  );

  const renderGuarantorFields = () => (
    <>
      <div className={styles.inputField}>
        <label className={styles.llabel}>Guarantor's Name</label>
        <div className={styles.inputWrapper}>
          <input
            type="text"
            name="guarantorName"
            value={formData.guarantorName}
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
        <label className={styles.llabel}>Guarantor's Parent Name</label>
        <div className={styles.inputWrapper}>
          <input
            type="text"
            name="guarantorParentName"
            value={formData.guarantorParentName}
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
            name={activePage === "user" ? "address" : "guarantorAddress"}
            value={
              activePage === "user"
                ? formData.address
                : formData.guarantorAddress
            }
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
            name={activePage === "user" ? "mobileNo" : "guarantorMobileNo"}
            value={
              activePage === "user"
                ? formData.mobileNo
                : formData.guarantorMobileNo
            }
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

      <div className={styles.inputField}>
        <label className={styles.llabel}>Bank Account Number</label>
        <div className={styles.inputWrapper}>
          <input
            type="text"
            name={
              activePage === "user" ? "bankAccountNo" : "guarantorBankAccountNo"
            }
            value={
              activePage === "user"
                ? formData.bankAccountNo
                : formData.guarantorBankAccountNo
            }
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
            name={activePage === "user" ? "panNo" : "guarantorPanNo"}
            value={
              activePage === "user" ? formData.panNo : formData.guarantorPanNo
            }
            onChange={handleInputChange}
            className={styles.input}
            pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}"
            required
          />
        </div>
      </div>
    </>
  );

  return (
    <div className={styles.formSection}>
      {activePage === "user" ? renderUserFields() : renderGuarantorFields()}

      {/* Remove the duplicate common fields section */}
      
      {/* Add submit button */}
      <div className={styles.buttonContainer}>
        <Button
          type="submit"
          text={activePage === "user" ? "Submit User Details" : "Submit Guarantor Details"}
          onClick={(e) => {
            e.preventDefault();
            // Handle form submission based on activePage
            console.log(`Submitting ${activePage} data:`, formData);
            // Add your submission logic here
          }}
          className={`${styles.submitButton} w-full mt-4`}
        />
      </div>
    </div>
  );
};

export default UserGuaranteeForm;
