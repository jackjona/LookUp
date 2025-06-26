"use client";

import { useEffect, useState } from "react";
import FlightRoute from "@/components/FlightRoute";
import PlaneImage from "@/components/PlaneImage";

export default function FlightDetails() {
  const [lat, setLat] = useState("43.85"); // Default latitude
  const [lon, setLon] = useState("-79.530"); // Default longitude
  const [flights, setFlights] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [enabled, setEnabled] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [showForm, setShowForm] = useState(false);

  // Load saved coordinates from localStorage
  useEffect(() => {
    const savedLat = localStorage.getItem("lat");
    const savedLon = localStorage.getItem("lon");
    if (savedLat && savedLon) {
      setLat(savedLat);
      setLon(savedLon);
    }
  }, []);

  // Save coordinates to localStorage when they change
  useEffect(() => {
    localStorage.setItem("lat", lat);
    localStorage.setItem("lon", lon);
  }, [lat, lon]);

  // Fetch flights
  const fetchFlights = async () => {
    setIsLoading(true);
    setError(false);
    try {
      const url = `https://corsproxy.io/?url=https://opendata.adsb.fi/api/v2/lat/${lat}/lon/${lon}/dist/5`;
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
      const data = await res.json();
      setFlights(data);
    } catch (error) {
      console.error(error.message);
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFlights();
  }, [refreshTrigger]);

  // Countdown for auto-refresh
  useEffect(() => {
    if (!enabled) return;
    const interval = setInterval(() => {
      setCountdown((prev) => (prev > 1 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [enabled]);

  // Trigger refresh
  useEffect(() => {
    if (!enabled || countdown > 0) return;
    setRefreshTrigger((prev) => prev + 1);
    setCountdown(5); // Reset the timer
  }, [countdown, enabled]);

  const toggleRefresh = () => {
    setEnabled((prev) => !prev);
    setCountdown(5);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setRefreshTrigger((prev) => prev + 1);
  };

  // Use browser geolocation for coordinates
  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLat(latitude.toFixed(4));
        setLon(longitude.toFixed(4));
        setRefreshTrigger((prev) => prev + 1);
      },
      (err) => {
        alert("Unable to retrieve your location.");
        console.error(err.message);
      }
    );
  };

  return (
    <>
      <div className="pb-20">
        {/*      {isLoading && <p>Loading flights...</p>}
        {error && <p className="text-red-600">Error fetching flight data.</p>}
 */}
        {flights?.aircraft?.length > 0 && (
          <div>
            {flights.aircraft[0].r && (
              <PlaneImage registration={flights.aircraft[0].r} />
            )}
            <h2 className="text-2xl font-semibold mb-2">Flight Details</h2>
            {flights.aircraft[0].flight && (
              <p>
                <span className="font-bold">Flight Number:</span>{" "}
                {flights.aircraft[0].flight}
              </p>
            )}
            {flights.aircraft[0].t && (
              <p>
                <span className="font-bold">Plane:</span>{" "}
                {flights.aircraft[0].t}{" "}
                {flights.aircraft[0].desc && `(${flights.aircraft[0].desc})`}
              </p>
            )}
            {flights.aircraft[0].ownOp && (
              <p>
                <span className="font-bold">Flight Operator:</span>{" "}
                {flights.aircraft[0].ownOp}
              </p>
            )}
            {flights.aircraft[0].alt_baro && (
              <p>
                <span className="font-bold">Barometric Alt:</span>{" "}
                {flights.aircraft[0].alt_baro} ft
              </p>
            )}
            {flights.aircraft[0].flight && (
              <FlightRoute flightNumber={flights.aircraft[0].flight} />
            )}
          </div>
        )}

        {flights?.resultCount === 0 && (
          <div id="noPlane">
            <h2 className="text-2xl">
              There are currently no planes above you.
            </h2>
          </div>
        )}

        {flights?.aircraft?.length > 1 && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">
              Other Flights Nearby
            </h2>
            {flights.aircraft.slice(1).map((plane, index) => (
              <div key={index} className="mb-4">
                {plane.flight && (
                  <p>
                    <span className="font-bold">Flight Number:</span>{" "}
                    {plane.flight}
                  </p>
                )}
                {plane.t && (
                  <p>
                    <span className="font-bold">Plane:</span> {plane.t}{" "}
                    {plane.desc && `(${plane.desc})`}
                  </p>
                )}
                {plane.ownOp && (
                  <p>
                    <span className="font-bold">Flight Operator:</span>{" "}
                    {plane.ownOp}
                  </p>
                )}
                {plane.alt_baro && (
                  <p>
                    <span className="font-bold">Barometric Alt:</span>{" "}
                    {plane.alt_baro} ft
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      {flights && (
        <div id="customCoordinates" className="mb-10 mx-10">
          <div
            onClick={() => setShowForm((prev) => !prev)}
            className="cursor-pointer flex items-center justify-between p-4 rounded-t-md shadow-sm 
             bg-gray-50 hover:bg-gray-100 border  border-gray-200
             dark:bg-white/20 dark:hover:bg-white/10 dark:border-gray-500"
          >
            <span className="text-xl font-semibold">Custom Coordinates</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-5 w-5 transform transition-transform duration-300 ${
                showForm ? "rotate-180" : ""
              }`}
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 10.92l3.71-3.69a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.06z"
                clipRule="evenodd"
              />
            </svg>
          </div>

          {showForm && (
            <form
              onSubmit={handleSubmit}
              className="mb-10 mx-auto p-7 rounded-b-xl shadow-sm flex flex-col gap-5 items-center transform transition duration-300 hover:shadow-md border border-t-0 bg-gray-50 border-gray-200
             dark:bg-white/20 dark:border-gray-500"
            >
              <div className="flex flex-col w-full">
                <label
                  htmlFor="lat"
                  className="text-sm font-medium mb-1.5 text-left"
                >
                  Latitude
                </label>
                <input
                  id="lat"
                  type="number"
                  step="0.0001"
                  value={lat}
                  onChange={(e) => setLat(e.target.value)}
                  placeholder="43.85"
                  className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:border-blue-400 focus:ring-1 focus:ring-blue-100 focus:outline-none transition duration-150 ease-in-out placeholder-gray-300"
                />
              </div>

              <div className="flex flex-col w-full">
                <label
                  htmlFor="lon"
                  className="text-sm font-medium mb-1.5 text-left"
                >
                  Longitude
                </label>
                <input
                  id="lon"
                  type="number"
                  step="0.0001"
                  value={lon}
                  onChange={(e) => setLon(e.target.value)}
                  placeholder="-79.530"
                  className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:border-blue-400 focus:ring-1 focus:ring-blue-100 focus:outline-none transition duration-150 ease-in-out placeholder-gray-300"
                />
              </div>

              <div className="flex flex-col sm:flex-row w-full gap-3 mt-2">
                <button
                  type="submit"
                  className="flex-grow px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition duration-150 ease-in-out"
                >
                  Submit
                </button>
                <button
                  type="button"
                  onClick={handleUseMyLocation}
                  className="flex-grow px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-md shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-1 transition duration-150 ease-in-out"
                >
                  Use My Location
                </button>
              </div>
            </form>
          )}
        </div>
      )}
      <button
        id="autoRefreshButton"
        onClick={toggleRefresh}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            toggleRefresh();
          }
        }}
        aria-pressed={enabled}
        aria-live="polite"
        aria-label={
          enabled
            ? `Auto-refresh enabled. Refreshing in ${countdown} seconds. Click to disable.`
            : "Auto-refresh disabled. Click to enable."
        }
        className={`fixed bottom-4 right-4 px-3 py-1 opacity-70 rounded-md text-sm transition-all duration-300 transform focus:outline-none focus:ring-2 focus:ring-offset-2 ${
          enabled ? "bg-black text-white" : "bg-gray-300 text-black"
        } hover:scale-105`}
      >
        {enabled ? `Refreshing in ${countdown}s` : "Turn On Auto-Refresh"}
      </button>
    </>
  );
}
