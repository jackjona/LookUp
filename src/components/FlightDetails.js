"use client";

import { useState } from "react";
import FlightRoute from "@/components/FlightRoute";
import PlaneImage from "@/components/PlaneImage";
import useLocation, { DEFAULT_COORDS } from "@/app/utils/useLocation";
import useFlights from "@/app/utils/useFlights";

const LOCATION_LABELS = {
  granted: "Your GPS location",
  geoip: "Approximate IP location",
  custom: "Custom coordinates",
  default: "Default location",
};

export default function FlightDetails() {
  const { flights, fetchFlights, autoRefresh, countdown, toggleAutoRefresh } =
    useFlights();
  const {
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
    useDefault,
  } = useLocation(fetchFlights);

  const [showForm, setShowForm] = useState(false);
  const [showManualForm, setShowManualForm] = useState(false);

  const needsLocation =
    locationState === "pending" || locationState === "denied";

  if (needsLocation) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center gap-6">
        <h2 className="text-2xl font-semibold">Where are you?</h2>
        <p className="text-gray-500 dark:text-gray-400 max-w-sm text-sm">
          To show planes flying above you, this app needs your location.
        </p>

        <div className="flex flex-col w-full max-w-xs gap-3">
          <button
            onClick={requestGPS}
            className="w-full px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition cursor-pointer"
          >
            Use My Precise Location
          </button>
          <button
            onClick={requestGeoIP}
            className="w-full px-4 py-2.5 bg-gray-200 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-300 transition cursor-pointer"
          >
            Use IP Location
          </button>
          <button
            onClick={() => setShowManualForm((prev) => !prev)}
            className="w-full px-4 py-2.5 bg-gray-100 text-gray-600 text-sm font-medium rounded-md hover:bg-gray-200 transition dark:bg-white/10 dark:text-gray-300"
          >
            Enter Coordinates Manually
          </button>
          <button
            onClick={useDefault}
            className="text-gray-400 text-xs underline hover:text-gray-600 transition cursor-pointer"
          >
            Use default location (GTA)
          </button>
        </div>

        {showManualForm && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              apply(lat, lon, "custom");
            }}
            className="w-full max-w-xs p-5 rounded-xl border border-gray-200 dark:border-gray-500 bg-gray-50 dark:bg-white/20 flex flex-col gap-4"
          >
            <CoordInput
              label="Latitude"
              value={lat}
              onChange={setLat}
              placeholder={DEFAULT_COORDS.lat}
            />
            <CoordInput
              label="Longitude"
              value={lon}
              onChange={setLon}
              placeholder={DEFAULT_COORDS.lon}
            />
            <button
              type="submit"
              className="w-full px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition cursor-pointer"
            >
              Search
            </button>
          </form>
        )}
      </div>
    );
  }

  const [topFlight, ...otherFlights] = flights?.aircraft ?? [];

  return (
    <>
      <div className="pb-20">
        {topFlight && (
          <div>
            {topFlight.r && <PlaneImage registration={topFlight.r} />}
            <h2 className="text-2xl font-semibold mb-2">Flight Details</h2>
            <FlightField label="Flight Number" value={topFlight.flight} />
            <FlightField
              label="Plane"
              value={
                topFlight.t &&
                `${topFlight.t}${topFlight.desc ? ` (${topFlight.desc})` : ""}`
              }
            />
            <FlightField label="Operator" value={topFlight.ownOp} />
            <FlightField
              label="Altitude"
              value={topFlight.alt_baro && `${topFlight.alt_baro} ft`}
            />
            <FlightField label="Year" value={topFlight.year} />
            {topFlight.flight && (
              <FlightRoute flightNumber={topFlight.flight} />
            )}
          </div>
        )}

        {flights?.resultCount === 0 && (
          <h2 className="text-2xl">There are currently no planes above you.</h2>
        )}

        {otherFlights.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">
              Other Flights Nearby
            </h2>
            {otherFlights.map((plane, i) => (
              <div key={i} className="mb-4">
                <FlightField label="Flight Number" value={plane.flight} />
                <FlightField
                  label="Plane"
                  value={
                    plane.t &&
                    `${plane.t}${plane.desc ? ` (${plane.desc})` : ""}`
                  }
                />
                <FlightField label="Operator" value={plane.ownOp} />
                <FlightField
                  label="Altitude"
                  value={plane.alt_baro && `${plane.alt_baro} ft`}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {flights && (
        <div className="mb-10 mx-10">
          <button
            onClick={() => setShowManualForm((prev) => !prev)}
            className="w-full flex items-center justify-between p-4 rounded-t-md bg-gray-50 hover:bg-gray-100 border border-gray-200 dark:bg-white/20 dark:hover:bg-white/10 dark:border-gray-500"
          >
            <div className="flex flex-col text-left">
              <span className="text-xl font-semibold">Custom Coordinates</span>
              <span className="text-xs text-gray-400 mt-0.5">
                {LOCATION_LABELS[locationState]}
              </span>
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-5 w-5 transition-transform duration-300 ${showForm ? "rotate-180" : ""}`}
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 10.92l3.71-3.69a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.06z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          {showForm && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                apply(lat, lon, "custom");
              }}
              className="p-7 rounded-b-xl border border-t-0 border-gray-200 bg-gray-50 dark:bg-white/20 dark:border-gray-500 flex flex-col gap-5"
            >
              <CoordInput
                label="Latitude"
                value={lat}
                onChange={setLat}
                placeholder={DEFAULT_COORDS.lat}
              />
              <CoordInput
                label="Longitude"
                value={lon}
                onChange={setLon}
                placeholder={DEFAULT_COORDS.lon}
              />

              <div className="flex flex-col">
                <label className="text-sm font-medium mb-1.5">
                  Search Radius (nautical miles)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="1"
                    max="250"
                    value={dist}
                    onChange={(e) => setDist(e.target.value)}
                    className="flex-grow accent-blue-600"
                  />
                  <span className="text-sm font-medium w-14 text-right tabular-nums">
                    {dist} nm
                  </span>
                </div>
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  {["1", "50", "100", "250"].map((n) => (
                    <span key={n}>{n}</span>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition cursor-pointer"
                >
                  Submit
                </button>
                <button
                  type="button"
                  onClick={requestGPS}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-300 transition cursor-pointer"
                >
                  Use My Location
                </button>
              </div>

              <div className="flex gap-2 border-t border-gray-200 dark:border-gray-600 pt-4">
                {[
                  ["Request GPS", requestGPS],
                  ["Use IP", requestGeoIP],
                  ["Reset", useDefault],
                ].map(([label, handler]) => (
                  <button
                    key={label}
                    type="button"
                    onClick={handler}
                    className="flex-1 px-3 py-1.5 text-xs bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 transition dark:bg-white/10 dark:text-gray-300"
                  >
                    {label}
                  </button>
                ))}
              </div>
            </form>
          )}
        </div>
      )}

      <button
        onClick={toggleAutoRefresh}
        aria-pressed={autoRefresh}
        className={`fixed bottom-4 right-4 px-3 py-1 opacity-70 rounded-md text-sm transition hover:scale-105 ${autoRefresh ? "bg-black text-white" : "bg-gray-300 text-black"}`}
      >
        {autoRefresh ? `Refreshing in ${countdown}s` : "Turn On Auto-Refresh"}
      </button>
    </>
  );
}

function FlightField({ label, value }) {
  if (!value) return null;
  return (
    <p>
      <span className="font-bold">{label}:</span> {value}
    </p>
  );
}

function CoordInput({ label, value, onChange, placeholder }) {
  return (
    <div className="flex flex-col">
      <label className="text-sm font-medium mb-1.5">{label}</label>
      <input
        type="number"
        step="0.0001"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:border-blue-400 focus:ring-1 focus:ring-blue-100 focus:outline-none transition placeholder-gray-300"
      />
    </div>
  );
}
