"use client";

import { useState, useEffect } from "react";

interface CountdownProps {
  targetDate: string; // ISO date string
}

export function Countdown({ targetDate }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const target = new Date(targetDate).getTime();

    const update = () => {
      const now = Date.now();
      const diff = Math.max(0, target - now);
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <div className="flex gap-4 justify-center text-center">
      {(["days", "hours", "minutes", "seconds"] as const).map((unit) => (
        <div key={unit} className="flex flex-col">
          <span className="text-3xl md:text-5xl font-bold font-heading tabular-nums">
            {String(timeLeft[unit]).padStart(2, "0")}
          </span>
          <span className="text-xs uppercase text-muted-foreground mt-1">{unit}</span>
        </div>
      ))}
    </div>
  );
}
