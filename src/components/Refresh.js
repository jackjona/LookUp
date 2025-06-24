"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function RefreshTimer() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);

  // Countdown effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => (prev > 1 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Refresh trigger effect
  useEffect(() => {
    if (countdown === 0) {
      router.refresh();
      setCountdown(5); // Reset countdown after refresh
    }
  }, [countdown, router]);

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white px-3 py-1 rounded-md opacity-70 text-sm">
      Refreshing in {countdown}s
    </div>
  );
}
