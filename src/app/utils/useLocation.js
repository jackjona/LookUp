import { useState, useEffect } from "react";

const DEFAULT_COORDS = { lat: "43.85", lon: "-79.530", dist: "10" }; // Set some default/placeholder values

function loadPrefs() {
  if (typeof window === "undefined") return null;
  const lat = localStorage.getItem("lat");
  const lon = localStorage.getItem("lon");
  const locationState = localStorage.getItem("locationState");
  if (!lat || !lon || !locationState || locationState === "pending")
    return null;
  return {
    lat,
    lon,
    dist: localStorage.getItem("dist") ?? DEFAULT_COORDS.dist,
    locationState,
  };
}

export { DEFAULT_COORDS };

export default function useLocation(onReady) {
  const saved = loadPrefs();

  const [lat, setLat] = useState(saved?.lat ?? DEFAULT_COORDS.lat);
  const [lon, setLon] = useState(saved?.lon ?? DEFAULT_COORDS.lon);
  const [dist, setDist] = useState(saved?.dist ?? DEFAULT_COORDS.dist);
  const [locationState, setLocationState] = useState(
    saved?.locationState ?? "pending",
  );

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

  useEffect(() => {
    if (saved) onReady(saved.lat, saved.lon, saved.dist);
    else requestGPS();
  }, []);

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
