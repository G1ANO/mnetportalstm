// NotificationPanel.jsx
import React, { useEffect, useState } from "react";
import api from "../api";

function NotificationPanel() {
  const [daysLeft, setDaysLeft] = useState(null);

  useEffect(() => {
    // Fetch subscription info from backend
    api.get("/api/subscription")
      .then((res) => {
        const endDate = new Date(res.data.subscriptionEndDate);
        const today = new Date();
        const diff = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));
        setDaysLeft(diff);
      })
      .catch((err) => console.log("Error fetching subscription:", err));
  }, []);

  // If subscription is fine, show nothing
  if (daysLeft === null || daysLeft > 5) {
    return null;
  }

  return (
    <div
      style={{
        backgroundColor: "#fff8e1",
        borderLeft: "5px solid #ff9800",
        padding: "10px",
        borderRadius: "8px",
        marginBottom: "10px",
      }}
    >
      <h3 style={{ color: "#e65100" }}>⚠️ Subscription Ending Soon!</h3>
      <p>
        Your subscription expires in <b>{daysLeft}</b>{" "}
        {daysLeft === 1 ? "day" : "days"}.
      </p>
    </div>
  );
}

export default NotificationPanel;
