import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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
  const [loading, setLoading] = useState(false);

  
  useEffect(() => {
    const fetchProfile = async () => {
      const accessToken = localStorage.getItem("accessToken");

      // If no access token is found, redirect to login
      if (!accessToken) {
        alert("Access token is missing. Please log in.");
        navigate("/login");
        return;
      }

      setLoading(true); 
      try {
        const response = await axios.get("http://localhost:5000/api/profile", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (response.data.status === "success") {
          setProfile(response.data.userProfile);
          setUpdatedProfile(response.data.userProfile); // Pre-fill the form with existing data
        } else {
          alert(response.data.message || "Failed to fetch profile.");
        }
      } catch (error) {
        console.error("Error fetching profile:", error.response?.data || error.message);
        alert(error.response?.data?.message || "Failed to fetch profile. Please try again.");
        if (error.response?.status === 401) {
          // Token invalid or expired
          alert("Session expired. Please log in again.");
          localStorage.removeItem("accessToken");
          navigate("/login");
        }
      } finally {
        setLoading(false); // Stop loading spinner
      }
    };

    fetchProfile();
  }, [navigate]);

  // Handle input change in the update form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedProfile({ ...updatedProfile, [name]: value });
  };

  // Send OTP to new email
  const handleSendOtp = async () => {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      alert("You're not logged in.");
      navigate("/login");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/user/send-otp",
        { email: updatedProfile.email },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.data.status === "success") {
        alert("OTP sent to the new email address.");
        setOtpSent(true);
      } else {
        alert(response.data.message || "Failed to send OTP.");
      }
    } catch (error) {
      console.error("Error sending OTP:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Failed to send OTP. Please try again.");
    }
  };

  // Handle profile update submission
  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      alert("You're not logged in.");
      navigate("/login");
      return;
    }

    try {
      const payload = {
        profile: updatedProfile,
      };

      if (updatedProfile.email !== profile.email) {
        payload.email = updatedProfile.email;
        payload.otp = otp;
      }

      const response = await axios.patch(
        "http://localhost:5000/api/user/update-profile",
        payload,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.data.status === "success") {
        alert("Profile updated successfully.");
        setProfile(updatedProfile);
        setIsEditing(false);
        setOtp("");
        setOtpSent(false);
      } else {
        alert(response.data.message || "Failed to update profile.");
      }
    } catch (error) {
      console.error("Error updating profile:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Failed to update profile. Please try again.");
    }
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
            <button
              onClick={() => setIsEditing(true)}
              className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none"
            >
              Edit Profile
            </button>
            <button
  onClick={() => navigate("/register")}
  className="mt-4 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 focus:outline-none"
>
  Logout
</button>

          </div>
        ) : (
          <form onSubmit={handleUpdateProfile}>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2" htmlFor="name">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={updatedProfile.name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2" htmlFor="address">
                Address
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={updatedProfile.address}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={updatedProfile.email}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
              />
              {otpSent && (
                <input
                  type="text"
                  id="otp"
                  name="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter OTP"
                  className="w-full px-4 py-2 mt-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                />
              )}
              {!otpSent && (
                <button
                  type="button"
                  onClick={handleSendOtp}
                  className="mt-2 bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600 focus:outline-none"
                >
                  Send OTP
                </button>
                
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 focus:outline-none"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="w-full bg-gray-500 text-white py-2 px-4 rounded mt-2 hover:bg-gray-600 focus:outline-none"
            >
              Cancel
            </button>
            
          </form>
        )}
      </div>
    </div>
  );
};

export default Profile;
