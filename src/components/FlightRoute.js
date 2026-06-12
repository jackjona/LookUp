"use client";
import { useEffect, useState } from "react";
function SkeletonLoader() {
  return (
    <div className="animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/40 p-6 h-36 w-full" />
  );
}

function FlightPath() {
  return (
    <div className="relative flex items-center justify-center w-32 sm:w-48 shrink-0">
      <svg
        viewBox="0 0 192 24"
        className="w-full"
        aria-hidden="true"
        fill="none"
      >
        <line
          x1="16"
          y1="12"
          x2="176"
          y2="12"
          stroke="#38bdf8"
          strokeWidth="1.5"
          strokeDasharray="6 4"
          strokeLinecap="round"
          className="opacity-60 dark:opacity-100"
        />
        <circle
          cx="12"
          cy="12"
          r="4"
          fill="#38bdf8"
          className="opacity-70 dark:opacity-100"
        />
        <circle
          cx="180"
          cy="12"
          r="4"
          fill="#38bdf8"
          className="opacity-70 dark:opacity-100"
        />
      </svg>

      <span
        className="absolute text-indigo-500 dark:text-indigo-400 text-xl select-none"
        style={{ animation: "fly 3s ease-in-out infinite" }}
        aria-hidden="true"
      >
        ✈
      </span>

      <style>{`
        @keyframes fly {
          0%   { left: 8%;  opacity: 0; transform: translateY(-1px); }
          10%  { opacity: 1; }
          90%  { opacity: 1; }
          100% { left: 82%; opacity: 0; transform: translateY(-3px); }
        }
      `}</style>
    </div>
  );
}

function AirportCard({ airport, label }) {
  return (
    <div className="flex flex-col gap-1 min-w-0">
      <span className="font-mono text-[10px] font-semibold tracking-widest uppercase text-indigo-500/70 dark:text-indigo-400/70 mb-0.5">
        {label}
      </span>
      <span className="font-mono font-bold text-4xl sm:text-5xl tracking-tight text-slate-900 dark:text-white leading-none">
        {airport.iata_code}
      </span>
      <span className="font-mono text-xs text-slate-400 dark:text-slate-500 tracking-widest">
        {airport.icao_code}
      </span>
      <span className="text-sm font-medium text-slate-700 dark:text-slate-200 mt-1 truncate">
        {airport.municipality}
        <span className="text-slate-400 dark:text-slate-500">
          , {airport.country_name}
        </span>
      </span>
      <span className="text-xs text-slate-400 dark:text-slate-500 truncate max-w-[160px]">
        {airport.name}
      </span>
    </div>
  );
}

export default function FlightRoute({ flightNumber }) {
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [flightRoute, setFlightRoute] = useState(null);

  useEffect(() => {
    async function getFlightRoute() {
      try {
        const res = await fetch(
          `https://api.adsbdb.com/v0/callsign/${flightNumber}`,
        );
        if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
        const data = await res.json();
        setFlightRoute(data);
      } catch (err) {
        setError(true);
        console.error("Error loading flight route");
      } finally {
        setIsLoading(false);
      }
    }

    getFlightRoute();
  }, [flightNumber]);

  const route = flightRoute?.response?.flightroute;

  return (
    <section
      aria-labelledby="flightRouteHeading"
      className="mx-auto my-4 max-w-2xl px-4"
      role="region"
    >
      {/* Loading */}
      {!error && isLoading && (
        <SkeletonLoader aria-busy="true" aria-label="Loading flight route" />
      )}

      {/* Error */}
      {error && !isLoading && (
        <div className="rounded-2xl border border-red-200 dark:border-red-500/30 bg-red-50 dark:bg-red-950/30 p-6 text-center">
          <p className="text-red-500 dark:text-red-400 text-sm font-medium">
            Unable to load route for{" "}
            <span className="font-mono font-bold">{flightNumber}</span>
          </p>
          <p className="text-slate-400 dark:text-slate-500 text-xs mt-1">
            Check the callsign and try again.
          </p>
        </div>
      )}

      {/* Success */}
      {!isLoading && route && (
        <div
          className="
            relative overflow-hidden rounded-2xl
            border border-slate-200 dark:border-slate-700/50
            bg-white dark:bg-gradient-to-br dark:from-slate-900 dark:via-slate-900 dark:to-slate-800
            shadow-sm dark:shadow-none
            transition-all duration-300
            hover:border-indigo-300/60 dark:hover:border-indigo-500/30
            hover:shadow-md dark:hover:shadow-[0_0_60px_rgba(56,189,248,0.1)]
          "
          style={{ animation: "fadeSlideIn 0.45s ease both" }}
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.015] dark:opacity-[0.03]"
            style={{
              backgroundImage:
                "linear-gradient(#38bdf8 1px, transparent 1px), linear-gradient(90deg, #38bdf8 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
            aria-hidden="true"
          />

          {/* top bar */}
          <div className="relative flex items-center justify-between px-6 py-3 border-b border-slate-100 dark:border-slate-700/40">
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
              <span className="font-mono text-[11px] font-semibold tracking-widest uppercase text-slate-500 dark:text-slate-400">
                {route.airline?.name ?? "Unknown Airline"}
              </span>
            </div>
            <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400 tracking-widest bg-indigo-50 dark:bg-indigo-400/10 px-2.5 py-0.5 rounded-full border border-indigo-200/80 dark:border-indigo-400/20">
              {route.callsign ?? route.callsign_iata}
            </span>
          </div>

          <div className="relative flex items-center justify-between gap-4 px-6 py-6">
            <AirportCard airport={route.origin} label="Origin" />
            <FlightPath />
            <AirportCard airport={route.destination} label="Destination" />
          </div>

          <div className="relative flex justify-between px-6 py-2.5 border-t border-slate-100 dark:border-slate-700/40 text-[10px] font-mono text-slate-400 dark:text-slate-600 tracking-widest">
            <span>ELEV {route.origin.elevation}ft</span>
            <span className="text-slate-300 dark:text-slate-700">
              {route.origin.latitude.toFixed(2)}°N /{" "}
              {Math.abs(route.origin.longitude).toFixed(2)}°E →{" "}
              {route.destination.latitude.toFixed(2)}°N /{" "}
              {Math.abs(route.destination.longitude).toFixed(2)}°W
            </span>
            <span>ELEV {route.destination.elevation}ft</span>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}
