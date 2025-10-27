// LoyaltyPoints.jsx
import React, { useEffect, useState } from "react";

function LoyaltyPoints() {
  const [points, setPoints] = useState(0);
  const [message, setMessage] = useState("");

  // Get points from backend
  useEffect(() => {
    fetch("http://localhost:5000/api/loyalty")
      .then((res) => res.json())
      .then((data) => setPoints(data.points))
      .catch((err) => console.log("Error fetching points:", err));
  }, []);

  // Redeem button handler
  function handleRedeem() {
    if (points < 100) {
      setMessage("You need at least 100 points to redeem.");
      return;
    }

    fetch("http://localhost:5000/api/loyalty/redeem", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: 100 }),
    })
      .then((res) => res.json())
      .then((data) => {
        setPoints(data.newPoints);
        setMessage(data.message);
      })
      .catch(() => setMessage("Something went wrong."));
  }

  return (
    <div
      style={{
        backgroundColor: "white",
        border: "1px solid #ddd",
        padding: "15px",
        borderRadius: "10px",
        maxWidth: "300px",
      }}
    >
      <h3>🎁 Loyalty Points</h3>
      <p>You have <b>{points}</b> points.</p>
      <button
        onClick={handleRedeem}
        style={{
          backgroundColor: "#6a1b9a",
          color: "white",
          border: "none",
          padding: "10px",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        Redeem 100 Points
      </button>

      {message && <p style={{ marginTop: "10px", color: "green" }}>{message}</p>}
    </div>
  );
}

export default LoyaltyPoints;
