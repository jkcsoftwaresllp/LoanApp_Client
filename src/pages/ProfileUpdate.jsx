import React, { useState, useEffect } from "react";
import axios from "axios";
import { inputFieldConfig } from "../config/inputFieldConfig";
import { API_BASE_URL } from "../config";
import styles from "./style/ProfileUpdate.module.css";
import {
  CancelIcon,
  Nexticon,
  PrevIcon,
  CheckIcon,
} from "../components/common/assets";
import { IconBtn } from "../components/common/IconBtn";
import { useNavigate } from "react-router-dom";
import { showToast } from "../utils/toastUtils";

const ProfileUpdate = () => {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [step, setStep] = useState(1);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        setError("No authentication token found. Please login again.");
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}auth/profile`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();

      if (!data || !data.status === 'success') {
        throw new Error("No data received from server");
      }

      // Combine all the data into one object for the form
      const transformedData = {
        // Personal Details
        ...data.personalDetails,
        // Banking Info
        ...data.bankingInfo,
        // Employment Details
        ...data.employmentDetails,
        // Additional fields if needed
        uniqueCode: data.uniqueCode,
      };

      setProfileData(transformedData);
      setLoading(false);
    } catch (err) {
      console.error("Profile fetch error:", err);
      setError(err.response?.data?.message || "Failed to fetch profile data");
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const accessToken = localStorage.getItem("accessToken");
      const role = localStorage.getItem("role");

      const submitData = {
        name: profileData.full_name || profileData.name,
        email: profileData.email_id || profileData.email,
        phone: profileData.mobile_number || profileData.phone,
        address: profileData.current_address || profileData.address,
        user_id: profileData.user_id,
        role: role,
      };

      const response = await axios.patch(
        `${API_BASE_URL}auth/update-profile`,
        submitData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      showToast("success", "Profile updated successfully!");
      navigate("/profile");
    } catch (err) {
      console.error("Update error:", err);
      showToast("error", err.response?.data?.message || "Failed to update profile");
    }
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const steps = [
    {
      title: "Personal Information",
      fields: inputFieldConfig(false, true, profileData).slice(0, 8),
    },
    {
      title: "Employment & Income Details",
      fields: inputFieldConfig(false, true, profileData).slice(8, 18),
    },
    {
      title: "Banking & Financial Information",
      fields: inputFieldConfig(false, true, profileData).slice(18, 25),
    },
    {
      title: "KYC Details",
      fields: inputFieldConfig(false, true, profileData).slice(25),
    },
  ];

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleFormSubmit = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const role = localStorage.getItem("role");

      const submitData = {
        profile: {
          name: profileData.full_name || profileData.name,
          email: profileData.email_id || profileData.email,
          phone: profileData.mobile_number || profileData.phone,
          address: profileData.current_address || profileData.address,
          user_id: profileData.user_id,
        },
        bankingInfo: {
          user_id: profileData.user_id,
          bank_name: profileData.bank_name,
          branch: profileData.branch,
          account_number: profileData.account_number,
          account_type: profileData.account_type,
          salary_credit_mode: profileData.salary_credit_mode,
          credit_score: profileData.credit_score
        },
        employmentDetails: {
          user_id: profileData.user_id,
          employment_type: profileData.employment_type,
          company_name: profileData.company_name,
          company_type: profileData.company_type,
          current_job_designation: profileData.current_job_designation,
          official_email: profileData.official_email,
          business_details: profileData.business_details,
          annual_turnover: profileData.annual_turnover,
          existing_emi_commitments: profileData.existing_emi_commitments,
          other_income_sources: profileData.other_income_sources
        },
        personalDetails: {
          user_id: profileData.user_id,
          full_name: profileData.full_name,
          father_or_mother_name: profileData.father_or_mother_name,
          marital_status: profileData.marital_status,
          current_address: profileData.current_address,
          permanent_address: profileData.permanent_address,
          mobile_number: profileData.mobile_number,
          email_id: profileData.email_id,
          educational_qualification: profileData.educational_qualification
        }
      };

      console.log('Data being sent to API:', {
        profile: submitData.profile,
        bankingInfo: submitData.bankingInfo,
        employmentDetails: submitData.employmentDetails,
        personalDetails: submitData.personalDetails
      });

      const response = await axios.patch(
        `${API_BASE_URL}auth/update-profile`,
        submitData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      showToast("success", "Profile updated successfully!");
      navigate("/profile");
    } catch (err) {
      console.error("Update error:", err);
      showToast("error", err.response?.data?.message || "Failed to update profile");
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.header}>Update Profile</h2>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>{error}</div>
      ) : (
        <>
          <div className={styles.form}>
            {steps.map((stepData, index) =>
              step === index + 1 ? (
                <div key={index} className={styles.stepContainer}>
                  <h3 className={styles.stepTitle}>{stepData.title}</h3>

                  <div className={styles.fieldsGrid}>
                    {stepData.fields.map((field) => (
                      <div key={field.id} className={styles.fieldContainer}>
                        <label htmlFor={field.id} className={styles.label}>
                          {field.label}
                        </label>
                        {field.type === "select" ? (
                          <select
                            id={field.id}
                            value={profileData[field.id] || ""}
                            onChange={handleInputChange}
                            className={styles.select}
                          >
                            <option value="">Select {field.label}</option>
                            {field.options.map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type={field.type}
                            id={field.id}
                            value={profileData[field.id] || ""}
                            onChange={handleInputChange}
                            placeholder={field.placeholder}
                            className={styles.input}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : null
            )}
          </div>
          <div className={styles.buttonContainer}>
            {step > 1 ? (
              <IconBtn icon={PrevIcon} onClick={prevStep} />
            ) : (
              <IconBtn icon={CancelIcon} onClick={() => navigate(-1)} />
            )}
            {step < steps.length ? (
              <IconBtn icon={Nexticon} onClick={nextStep} />
            ) : (
              <IconBtn icon={CheckIcon} onClick={handleFormSubmit} />
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ProfileUpdate;
