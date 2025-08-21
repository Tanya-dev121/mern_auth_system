// export default ProfilePage;
import React, { useState, useEffect } from "react";
import { FaUserCircle, FaSignOutAlt } from "react-icons/fa"; // Import the new icon here
import "./Profile.css";
import { toast } from "react-toastify";

const ProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await fetch(`${API_URL}/profile`, {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch profile data");
        }

        const data = await response.json();
        setUserData(data);
      } catch (error) {
        setError("Error fetching data: " + error.message);
      }
    };
    fetchProfileData();
  }, []);

  const handleLogout = async (req, res) => {
    try {
      const response = await fetch(`${API_URL}/api/logout`, {
        method: "POST",
        // This is crucial for sending cookies with the request
        credentials: "include",
      });
      if (response.ok) {
        toast.success("User logout uccessfully !");
        setTimeout(() => {
          window.location.href = "/login";
        }, 1000);
      } else {
        toast.error("Logout failed. Please try again. ");
      }
    } catch (error) {
      toast.error("An error occurred during logout.");
    }
  };

  if (!userData) {
    return (
      <div className="profile-page">
        <div className="loading-message">Loading...</div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <FaUserCircle className="profile-icon" />
          <h2 className="profile-title">Profile</h2>
          <p className="profile-subtitle">{userData.message}</p>
        </div>
        <div className="profile-actions">
          <button onClick={handleLogout} className="logout-button">
            <FaSignOutAlt className="logout-icon" /> Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
