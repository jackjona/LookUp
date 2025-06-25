"use client";

import { useEffect, useState } from "react";
import FlightRoute from "@/components/FlightRoute";
import PlaneImage from "@/components/PlaneImage";

export default function FlightDetailsWithRefresh({ coordinates }) {
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [flights, setFlights] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [countdown, setCountdown] = useState(5);
  const [enabled, setEnabled] = useState(false);

  const fetchFlights = async () => {
    try {
      const res = await fetch(
        "https://corsproxy.io/?url=https://opendata.adsb.fi/api/v2/lat/43.85/lon/-79.530/dist/5",
        { cache: "no-store" }
      );
      if (!res.ok) {
        throw new Error(`Error ${res.status}: ${res.statusText}`);
      }
      const data = await res.json();
      setFlights(data);
    } catch (error) {
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFlights();
  }, [refreshTrigger]);

  // Countdown logic
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

  return (
    <>
      <div id="flightDetails" className="pb-20">
        {flights?.aircraft?.length > 0 && flights.aircraft[0] && (
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

        {error && (
          <div id="errorLoadingFlights">
            <h2 className="text-red-600 text-2xl break-words">
              An error has occurred loading your flights. Please refresh the
              page.
            </h2>
          </div>
        )}
        {flights?.resultCount === 0 && (
          <div id="noPlane">
            <h2 className="text-2xl">
              There are currently no planes flying above you.
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

      <button
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
