import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TextInput from "../components/common/TextInput";
import Button from "../components/common/Button";
import { inputFieldConfig } from "../config/inputFieldConfig";
import { buttonConfig } from "../config/buttonConfig";
import { apiprof, mailotp, prupdate } from "../utils/Api";
import { fetchProfile, sendOtp, updateProfile } from "../components/helper/profileService";

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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    fetchProfile(accessToken, apiprof, navigate, setLoading, setProfile, setUpdatedProfile);
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedProfile({ ...updatedProfile, [name]: value });
  };

  const handleSendOtp = () => {
    const accessToken = localStorage.getItem("accessToken");
    sendOtp(updatedProfile.email, accessToken, mailotp, navigate, (otpSuccess) => {
      if (otpSuccess) {
        setOtpSent(true);
        setOtpMessage("OTP has been sent to your new email address.");
      } else {
        setOtpMessage("Failed to send OTP. Please try again.");
      }
    });
    
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

    updateProfile(payload, accessToken, prupdate, navigate, setProfile, setIsEditing, setOtp, setOtpSent);
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-white p-8 shadow-lg rounded-lg w-96">
        <h2 className="text-2xl font-bold mb-4">Your Profile</h2>
        {loading ? (
          <p>Loading...</p>
        ) : !isEditing ? (
          <div>
            <p>
              <strong>Name:</strong> {profile.name || "N/A"}
            </p>
            <p>
              <strong>Address:</strong> {profile.address || "N/A"}
            </p>
            <p>
              <strong>Email:</strong> {profile.email || "N/A"}
            </p>
            <Button
              text="Edit Profile"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded mt-4 hover:bg-blue-600 focus:outline-none"
              onClick={() => setIsEditing(true)}
            />
            <Button
              text="Logout"
              className="w-full bg-red-500 text-white py-2 px-4 rounded mt-2 hover:bg-red-600 focus:outline-none"
              onClick={() => navigate("/register")}
            />
          </div>
        ) : (
          <form onSubmit={handleUpdateProfile}>
            {inputFieldConfig(null, false, true, updatedProfile).map((field) => (
              <TextInput
                key={field.id}
                config={{
                  ...field,
                  value: updatedProfile[field.id] || "",
                  disabled: otpSent && field.id === "email",
                }}
                onChange={handleInputChange}
              />
            ))}

            {updatedProfile.email !== profile.email && !otpSent && (
              <Button
                text="Send OTP"
                className="w-full bg-green-500 text-white py-2 px-4 rounded mt-2 hover:bg-green-600 focus:outline-none"
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

            <Button
              type="submit"
              text="Update Profile"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded mt-4 hover:bg-blue-600 focus:outline-none"
            />

            <Button
              type="button"
              text="Cancel"
              className="w-full bg-gray-500 text-white py-2 px-4 rounded mt-2 hover:bg-gray-600 focus:outline-none"
              onClick={() => setIsEditing(false)}
            />
          </form>
        )}
      </div>
    </div>
  );
};

export default Profile;
