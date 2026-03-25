import { useState, useEffect, useRef } from "react";

export default function useFlights() {
  const [flights, setFlights] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [countdown, setCountdown] = useState(10); // 10 second refresh duration
  const coordsRef = useRef(null);

  async function fetchFlights(lat, lon, dist) {
    coordsRef.current = { lat, lon, dist };
    try {
      const res = await fetch(
        `/adsb/api/v2/lat/${lat}/lon/${lon}/dist/${dist}`,
        { cache: "no-store" },
      );
      if (!res.ok) throw new Error();
      setFlights(await res.json());
    } catch {
      setFlights(null);
    }
  }

  useEffect(() => {
    if (!autoRefresh) return;
    const id = setInterval(() => {
      setCountdown((n) => {
        if (n > 1) return n - 1;
        if (coordsRef.current) {
          const { lat, lon, dist } = coordsRef.current;
          fetchFlights(lat, lon, dist);
        }
        return 10;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [autoRefresh]);

  return {
    flights,
    fetchFlights,
    autoRefresh,
    countdown,
    toggleAutoRefresh: () => {
      setAutoRefresh((p) => !p);
      setCountdown(10);
    },
  };
}
