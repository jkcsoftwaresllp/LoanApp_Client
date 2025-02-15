import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextInput } from "../components/common/TextInput";
import { Button } from "../components/common/Button";
import { inputFieldConfig } from "../config/inputFieldConfig";
import { apiprof, mailotp, prupdate } from "../utils/Api";
import { Loader } from "../components/common/Loader";
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
      navigate("/login");
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
          <div className={styles.profileHeader}>
            <img
              src="https://png.pngtree.com/png-vector/20231019/ourmid/pngtree-user-profile-avatar-png-image_10211467.png"
              alt="Profile"
              className={styles.profileImage}
            />
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

          {updatedProfile.email !== profile.email && !otpSent && (
            <Button text="Send OTP" onClick={handleSendOtp} />
          )}

          {otpSent && (
            <>
              <TextInput
                config={{
                  label: "Enter OTP",
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
