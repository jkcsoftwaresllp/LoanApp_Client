import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextInput } from "../components/common/TextInput";
import { Button } from "../components/common/Button";
import { inputFieldConfig } from "../config/inputFieldConfig";
import { apiprof, mailotp, prupdate } from "../utils/Api";
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
      <h2 className={styles.title}>Your Profile</h2>
      {loading ? (
        <p className={styles.loading}>Loading...</p>
      ) : !isEditing ? (
        <div className={styles.profileBox}>
          <p>
            <strong>Name:</strong> {profile.name || "N/A"}
          </p>
          <p>
            <strong>Address:</strong> {profile.address || "N/A"}
          </p>
          <p>
            <strong>Email:</strong> {profile.email || "N/A"}
          </p>
          <div className={styles.buttonContainer}>
            <Button
              text="Edit Profile"
              className={`${styles.buttonSave} w-full`}
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
              <TextInput
                key={field.id}
                className={styles.inputField}
                config={{
                  ...field,
                  value: updatedProfile[field.id] || "",
                  disabled: otpSent && field.id === "email",
                }}
                onChange={handleInputChange}
              />
            );
          })}

          {updatedProfile.email !== profile.email && !otpSent && (
            <Button
              text="Send OTP"
              className={`${styles.buttonSave} w-full bg-green-500 mt-2`}
              onClick={handleSendOtp}
            />
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
              text="Update Profile"
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
