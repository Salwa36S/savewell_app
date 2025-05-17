import React, { useEffect, useState } from "react";
import axios from "axios";

const Location = () => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const res = await axios.get("https://ipwho.is/");
        if (res.data.success === false) {
          throw new Error(res.data.message || "Failed to get location");
        }
        setLocation(res.data);
      } catch (err) {
        setError("⚠️ Could not fetch location data. " + (err.message || ""));
        console.error("Location fetch error:", err);
      }
    };

    fetchLocation();
  }, []);

  return (
    <div className="Location">
      {error ? (
        <p className="text-danger">{error}</p>
      ) : location ? (
        <>
          <p><strong>IP Address:</strong> {location.ip}</p>
          <p><strong>Country:</strong> {location.country}</p>
          <p><strong>Region:</strong> {location.region}</p>
          <p><strong>City:</strong> {location.city}</p>
          <p><strong>ISP:</strong> {location.connection?.isp || "N/A"}</p>
        </>
      ) : (
        <p>Loading Geolocation Data...</p>
      )}
    </div>
  );
};

export default Location;
