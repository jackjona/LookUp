"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function RefreshTimer() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);
  const [enabled, setEnabled] = useState(false);

  // Countdown logic
  useEffect(() => {
    if (!enabled) return;

    const interval = setInterval(() => {
      setCountdown((prev) => (prev > 1 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [enabled]);

  // Refresh trigger
  useEffect(() => {
    if (!enabled || countdown > 0) return;

    router.refresh();
    setCountdown(5);
  }, [countdown, enabled, router]);

  const toggleRefresh = () => {
    setEnabled((prev) => !prev);
    setCountdown(5);
  };

  return (
    <div
      onClick={toggleRefresh}
      className={`cursor-pointer fixed bottom-4 right-4 px-3 py-1 opacity-70 rounded-md text-sm transition-all duration-300 transform ${
        enabled ? "bg-black text-white" : "bg-gray-300 text-black"
      } hover:scale-105`}
    >
      {enabled ? `Refreshing in ${countdown}s` : "Auto-refresh OFF"}
    </div>
  );
}
