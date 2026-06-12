import { useState, useEffect } from "react";

export const DEFAULT_COORDS = { lat: "43.865", lon: "-79.553", dist: "5" };

export default function useLocation(onReady) {
  const [lat, setLat] = useState(DEFAULT_COORDS.lat);
  const [lon, setLon] = useState(DEFAULT_COORDS.lon);
  const [dist, setDist] = useState(DEFAULT_COORDS.dist);
  const [locationState, setLocationState] = useState("pending");

  useEffect(() => {
    const lat = localStorage.getItem("lat");
    const lon = localStorage.getItem("lon");
    const dist = localStorage.getItem("dist");
    const locationState = localStorage.getItem("locationState");

    if (lat && lon && locationState && locationState !== "pending") {
      setLat(lat);
      setLon(lon);
      setDist(dist ?? DEFAULT_COORDS.dist);
      setLocationState(locationState);
      onReady(lat, lon, dist ?? DEFAULT_COORDS.dist);
    } else {
      requestGPS();
    }
  }, []);

  function apply(newLat, newLon, newState) {
    setLat(newLat);
    setLon(newLon);
    setLocationState(newState);
    localStorage.setItem("lat", newLat);
    localStorage.setItem("lon", newLon);
    localStorage.setItem("dist", dist);
    localStorage.setItem("locationState", newState);
    onReady(newLat, newLon, dist);
  }

  function requestGPS() {
    navigator.geolocation.getCurrentPosition(
      ({ coords }) =>
        apply(
          coords.latitude.toFixed(4),
          coords.longitude.toFixed(4),
          "granted",
        ),
      () => setLocationState("denied"),
    );
  }

  async function requestGeoIP() {
    try {
      const { lat: newLat, lon: newLon } = await fetch("/api/geoip").then((r) =>
        r.json(),
      );
      apply(newLat, newLon, "geoip");
    } catch {
      setLocationState("denied");
    }
  }

  return {
    lat,
    lon,
    dist,
    locationState,
    setLat,
    setLon,
    setDist,
    apply,
    requestGPS,
    requestGeoIP,
    useDefault: () => apply(DEFAULT_COORDS.lat, DEFAULT_COORDS.lon, "default"),
  };
}
