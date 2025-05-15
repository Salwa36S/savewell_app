// client/src/Components/User.jsx

import React from "react";
import { useSelector } from "react-redux";

const User = () => {
  const { user } = useSelector((state) => state.users);

  const profilePicUrl = user.profilePic
    ? `http://localhost:3001/uploads/${user.profilePic}`
    : "https://via.placeholder.com/150"; // default image if no upload

  return (
    <div
      className="text-center p-4"
      style={{
        backgroundColor: "#f8f9fa",
        borderRadius: "15px",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      {/* Profile Image */}
      <img
        src={profilePicUrl}
        alt="Profile"
        style={{
          width: "140px",
          height: "140px",
          borderRadius: "50%",
          objectFit: "cover",
          boxShadow: "0 0 10px rgba(0,0,0,0.15)",
        }}
      />

      {/* User Name */}
      <h5 className="mt-3">{user.name || "Unknown User"}</h5>

      {/* User Email */}
      <p className="text-muted" style={{ fontSize: "14px" }}>
        {user.email || "No Email Provided"}
      </p>
    </div>
  );
};

export default User;
