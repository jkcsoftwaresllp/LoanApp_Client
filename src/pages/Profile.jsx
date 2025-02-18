import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextInput } from "../components/common/TextInput";
import { CustomTextInput } from "../components/common/CustomTextInput";
import { Button } from "../components/common/Button";
import { inputFieldConfig } from "../config/inputFieldConfig";
import { apiprof, mailotp, prupdate } from "../utils/Api";
import { Loader } from "../components/common/Loader";
import LogoutButton from "./LogoutButton";
import {
  fetchProfile,
  sendOtp,
  updateProfile,
} from "../components/helper/profileService";
import styles from "../Styles/Profile.module.css";

const Profile = () => {
  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    name: "",
    address: "",
    email: "",
  });
  const getInitials = (name) => {
    if (!name) return "U"; // Default if no name
    const nameParts = name.trim().split(" ");
    if (nameParts.length === 1) return nameParts[0][0].toUpperCase();
    return (nameParts[0][0] + nameParts[1][0]).toUpperCase();
  };
  const [isEditing, setIsEditing] = useState(false);
  const [updatedProfile, setUpdatedProfile] = useState({
    name: "",
    address: "",
    email: "",
  });
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpMessage, setOtpMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const handleLogout = () => {
    clearTokens();
    setIsAuthenticated(false);
    navigate("/login");
    showToast("info", "Session expired , please login again!");
  };

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      fetchProfile(
        accessToken,
        apiprof,
        navigate,
        setLoading,
        setProfile,
        setUpdatedProfile
      );
    } else {
      handleLogout();
    }
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedProfile({ ...updatedProfile, [name]: value });
  };

  const handleSendOtp = () => {
    const accessToken = localStorage.getItem("accessToken");
    sendOtp(
      updatedProfile.email,
      accessToken,
      mailotp,
      navigate,
      (otpSuccess) => {
        if (otpSuccess) {
          setOtpSent(true);
          setOtpMessage("OTP has been sent to your new email address.");
        } else {
          setOtpMessage("Failed to send OTP. Please try again.");
        }
      }
    );
  };

  const handleUpdateProfile = (e) => {
    e.preventDefault();

    const accessToken = localStorage.getItem("accessToken");
    const payload = {
      profile: updatedProfile,
    };

    if (updatedProfile.email !== profile.email) {
      payload.email = updatedProfile.email;
      payload.otp = otp;
    }

    updateProfile(
      payload,
      accessToken,
      prupdate,
      navigate,
      setProfile,
      setIsEditing,
      setOtp,
      setOtpSent
    );
  };

  return (
    <div className={styles.container}>
      {loading ? (
        <div className={styles.loading}>
          <Loader />
        </div>
      ) : !isEditing ? (
        <div className={styles.profileCard}>
          <div className={styles.logoutButton}>
            <LogoutButton />
          </div>
          <div className={styles.profileHeader}>
            <div className={styles.cardImage}> {getInitials(profile.name)}</div>
          </div>
          <h2 className={styles.profileName}>{profile.name || "N/A"}</h2>
          <p className={styles.profileemail}>{profile.email || "N/A"}</p>
          <p className={styles.profileLocation}>{profile.address || "N/A"}</p>

          <div className={styles.buttonContainer}>
            <Button
              text="Edit Profile"
              onClick={() => {
                setUpdatedProfile({ ...profile });
                setIsEditing(true);
              }}
            />
          </div>
        </div>
      ) : (
        <form onSubmit={handleUpdateProfile} className={styles.form}>
          {inputFieldConfig(false, true, updatedProfile).map((field) => {
            if (field.id === "email" && otpSent) return null;

            return (
              <div className={styles.inputContainer} key={field.id}>
                <TextInput
                  key={field.id}
                  config={{
                    ...field,
                    value: updatedProfile[field.id] || "",
                    disabled: otpSent && field.id === "email",
                  }}
                  onChange={handleInputChange}
                />
              </div>
            );
          })}
          <div className={styles.otpButton}>
            {updatedProfile.email !== profile.email && !otpSent && (
              <Button text="Send OTP" onClick={handleSendOtp} />
            )}
          </div>

          {otpSent && (
            <>
              <TextInput
                config={{
                  label: "Enter  OTP",
                  id: "otp",
                  type: "text",
                  placeholder: "Enter OTP",
                  disabled: false,
                  value: otp,
                }}
                onChange={(e) => setOtp(e.target.value)}
              />
              <p className="text-green-500 mt-2">{otpMessage}</p>
            </>
          )}

          <div className={styles.buttonContainer}>
            <Button
              type="submit"
              text="Update"
              className={`${styles.buttonSave} w-full`}
            />
            <Button
              type="button"
              text="Cancel"
              className={`${styles.buttonCancel} w-full mt-2`}
              onClick={() => setIsEditing(false)}
            />
          </div>
        </form>
      )}
    </div>
  );
};

export default Profile;
