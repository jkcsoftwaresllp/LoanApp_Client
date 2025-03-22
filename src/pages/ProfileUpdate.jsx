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

      const response = await axios.get(`${API_BASE_URL}auth/profile`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.data || !response.data.profile) {
        throw new Error("No data received from server");
      }

      // Transform the profile data to match our form fields
      const transformedData = {
        ...response.data.profile,
        mobile_number: response.data.profile.phone,
        email_id: response.data.profile.email,
        current_address: response.data.profile.address,
        full_name: response.data.profile.name,
      };

      setProfileData(transformedData);
      setLoading(false);
    } catch (err) {
      console.error("Profile fetch error:", err.response?.data || err.message);
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
