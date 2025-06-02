// CountdownTimer.jsx
import React, { useEffect, useState } from "react";
import { Card } from "primereact/card";

const CountdownTimer = ({ minutes = 1, onFinish, start }) => {
  const [timeLeft, setTimeLeft] = useState(minutes * 60);

  useEffect(() => {
    if (!start || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onFinish && onFinish();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [start]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  return (
    <Card className="countdown-card">
      <div className="countdown-time">
        Tiempo restante para finalizar la compra: {formatTime(timeLeft)}
      </div>
    </Card>
  );
};

export default CountdownTimer;
