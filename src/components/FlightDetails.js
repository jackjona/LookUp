"use client";

import { useState } from "react";
import FlightList from "@/components/FlightList";
import useLocation, { DEFAULT_COORDS } from "@/app/utils/useLocation";
import useFlights from "@/app/utils/useFlights";

const LOCATION_LABELS = {
  granted: "GPS",
  geoip: "IP location",
  custom: "Custom",
  default: "Default (GTA)",
};

function IconPlane({ className = "" }) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 17.5L19 12L5 6.5V10.5L15 12L5 13.5V17.5Z" />
    </svg>
  );
}

function IconTarget({ className = "" }) {
  return (
    <svg
      className={className}
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
    </svg>
  );
}

function IconGlobe({ className = "" }) {
  return (
    <svg
      className={className}
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

function IconRefresh({ className = "" }) {
  return (
    <svg
      className={className}
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="23 4 23 10 17 10" />
      <polyline points="1 20 1 14 7 14" />
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </svg>
  );
}

export function IconChevron({ open }) {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

export function CoordInput({ label, value, onChange, placeholder }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="font-mono text-[10px] font-semibold tracking-widest uppercase text-indigo-500/70 dark:text-indigo-400/60">
        {label}
      </label>
      <input
        type="number"
        step="0.0001"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="
          w-full font-mono text-[13px] px-3 py-2 rounded-lg outline-none
          bg-slate-100 dark:bg-slate-800/80
          border border-slate-200 dark:border-slate-700/60
          text-slate-900 dark:text-slate-100
          placeholder:text-slate-400 dark:placeholder:text-slate-600
          focus:border-indigo-400/60 dark:focus:border-indigo-500/50
          focus:ring-1 focus:ring-indigo-400/20 dark:focus:ring-indigo-500/10
          transition-all duration-150
          [appearance:textfield]
          [&::-webkit-outer-spin-button]:appearance-none
          [&::-webkit-inner-spin-button]:appearance-none
        "
      />
    </div>
  );
}

function Panel({ children, className = "" }) {
  return (
    <div
      className={`
        relative overflow-hidden rounded-2xl
        border border-slate-200 dark:border-slate-700/50
        bg-white dark:bg-gradient-to-br dark:from-slate-900 dark:via-slate-900 dark:to-slate-800
        shadow-sm dark:shadow-none
        transition-all duration-300
        ${className}
      `}
    >
      {/* dark mode grid effect*/}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 dark:opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(#38bdf8 1px, transparent 1px), linear-gradient(90deg, #38bdf8 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
        aria-hidden="true"
      />
      {children}
    </div>
  );
}

function BtnPrimary({ onClick, children, className = "" }) {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center justify-center gap-2
        py-2.5 px-4 rounded-xl
        bg-slate-900 dark:bg-indigo-500/90
        text-white dark:text-white
        text-[13px] font-medium tracking-wide
        hover:opacity-85 active:scale-[.98]
        transition-all duration-150
        ${className}
      `}
    >
      {children}
    </button>
  );
}

function BtnSecondary({ onClick, children, className = "" }) {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center justify-center gap-2
        py-2.5 px-4 rounded-xl
        bg-slate-100 dark:bg-slate-800/80
        border border-slate-200 dark:border-slate-700/60
        text-slate-700 dark:text-slate-300
        text-[13px] font-medium
        hover:bg-slate-200 dark:hover:bg-slate-700/70
        active:scale-[.98] transition-all duration-150
        ${className}
      `}
    >
      {children}
    </button>
  );
}

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

  const [showManualForm, setShowManualForm] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const needsLocation =
    locationState === "pending" || locationState === "denied";

  if (needsLocation) {
    return (
      <div className="flex items-center justify-center min-h-full p-12 border-3 rounded-2xl border-slate-200 dark:border-slate-800">
        <div className="w-full max-w-xs flex flex-col items-center text-center">
          <div
            className="
            w-12 h-12 rounded-full mb-5 flex items-center justify-center
            border border-slate-200 dark:border-slate-700/60
            bg-white dark:bg-slate-900
            text-indigo-500 dark:text-indigo-400
            shadow-sm dark:shadow-none
          "
          >
            <IconPlane />
          </div>

          <h1
            className="
            text-[18px] font-semibold tracking-tight
            text-slate-900 dark:text-slate-100
            mb-2
          "
          >
            What's overhead?
          </h1>
          <p
            className="
            font-mono text-[11px] tracking-widest uppercase
            text-indigo-500/70 dark:text-indigo-400/60
            mb-1
          "
          >
            Real-time aircraft tracker
          </p>
          <p
            className="
            text-[13px] text-slate-500 dark:text-slate-400
            leading-relaxed mb-8 mt-3
          "
          >
            Share your location to see aircraft flying above you right now.
          </p>

          {/* CTA stack */}
          <div className="w-full flex flex-col gap-2.5 mb-6">
            <BtnPrimary onClick={requestGPS} className="w-full">
              <IconTarget />
              Use precise location
            </BtnPrimary>
            <BtnSecondary onClick={requestGeoIP} className="w-full">
              <IconGlobe />
              Use IP location
            </BtnSecondary>
          </div>

          {/* divider */}
          <div className="w-full h-px bg-slate-200 dark:bg-slate-800 mb-5" />

          {/* manual coords toggle */}
          <button
            onClick={() => setShowManualForm((p) => !p)}
            aria-expanded={showManualForm}
            className="
              flex items-center gap-1.5
              font-mono text-[11px] tracking-widest uppercase
              text-slate-400 dark:text-slate-500
              hover:text-indigo-500 dark:hover:text-indigo-400
              transition-colors mb-4
            "
          >
            Enter coordinates
            <IconChevron open={showManualForm} />
          </button>

          {showManualForm && (
            <div
              className="w-full flex flex-col gap-3 mb-4"
              style={{ animation: "fadeSlideIn .2s ease both" }}
            >
              <div className="grid grid-cols-2 gap-2">
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
              </div>
              <BtnSecondary
                onClick={() => apply(lat, lon, "custom")}
                className="w-full"
              >
                Search this location
              </BtnSecondary>
            </div>
          )}

          <button
            onClick={useDefault}
            className="
              font-mono text-[10px] tracking-widest uppercase
              text-slate-400 dark:text-slate-600
              hover:text-slate-500 dark:hover:text-slate-400
              transition-colors mt-1
            "
          >
            Use default (GTA)
          </button>
        </div>

        {/* Subtle animation */}
        <style>{`
          @keyframes fadeSlideIn {
            from { opacity: 0; transform: translateY(6px); }
            to   { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 pt-6 pb-28min-h-dvh">
      <FlightList flights={flights} />

      {flights && (
        <Panel className="mt-6">
          <button
            onClick={() => setShowSettings((p) => !p)}
            aria-expanded={showSettings}
            className="
              relative z-10 w-full flex items-center justify-between
              px-5 py-3.5 text-left
              hover:bg-slate-50 dark:hover:bg-slate-800/30
              transition-colors duration-150
            "
          >
            <div className="flex items-center gap-3">
              <IconTarget className="text-indigo-500 dark:text-indigo-400" />
              <span className="text-[13px] font-medium text-slate-800 dark:text-slate-200">
                Location
              </span>
              {/* badge */}
              <span
                className="
                font-mono text-[10px] font-semibold tracking-widest uppercase
                text-indigo-500 dark:text-indigo-400
                bg-indigo-50 dark:bg-indigo-400/10
                border border-indigo-200/60 dark:border-indigo-400/20
                px-2 py-0.5 rounded-full
              "
              >
                {LOCATION_LABELS[locationState]}
              </span>
            </div>
            <IconChevron open={showSettings} />
          </button>

          {showSettings && (
            <div
              className="relative z-10 border-t border-slate-100 dark:border-slate-800/60 px-5 py-5 flex flex-col gap-5"
              style={{ animation: "fadeSlideIn .2s ease both" }}
            >
              <div className="grid grid-cols-2 gap-3">
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
              </div>
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <label className="font-mono text-[10px] font-semibold tracking-widest uppercase text-indigo-500/70 dark:text-indigo-400/60">
                    Search radius
                  </label>
                  <span className="font-mono text-[13px] font-bold text-slate-800 dark:text-slate-200 tabular-nums">
                    {dist} nm
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="250"
                  step="1"
                  value={dist}
                  onChange={(e) => setDist(e.target.value)}
                  className="
                    w-full h-1 rounded-full appearance-none cursor-pointer
                    bg-slate-200 dark:bg-slate-700
                    accent-indigo-500 dark:accent-indigo-400
                  "
                />
                <div className="flex justify-between font-mono text-[10px] text-slate-400 dark:text-slate-600 tracking-wide">
                  {["1 nm", "50", "100", "250 nm"].map((n) => (
                    <span key={n}>{n}</span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2">
                <BtnPrimary
                  onClick={() => apply(lat, lon, "custom")}
                  className="py-2 text-[12px] rounded-lg"
                >
                  Apply
                </BtnPrimary>
                {[
                  ["GPS", requestGPS],
                  ["IP", requestGeoIP],
                  ["Reset", useDefault],
                ].map(([label, handler]) => (
                  <button
                    key={label}
                    onClick={handler}
                    className="
                      py-2 font-mono text-[11px] font-semibold tracking-widest uppercase rounded-lg
                      bg-slate-100 dark:bg-slate-800/80
                      border border-slate-200 dark:border-slate-700/60
                      text-slate-500 dark:text-slate-400
                      hover:bg-slate-200 dark:hover:bg-slate-700/70
                      active:scale-[.97] transition-all duration-150
                    "
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <style>{`
            @keyframes fadeSlideIn {
              from { opacity: 0; transform: translateY(6px); }
              to   { opacity: 1; transform: translateY(0); }
            }
          `}</style>
        </Panel>
      )}

      {/* Auto-refresh button */}
      <button
        onClick={toggleAutoRefresh}
        aria-pressed={autoRefresh}
        className={`
          fixed bottom-5 right-5
          flex items-center gap-2 px-4 py-2.5
          rounded-full font-mono text-[11px] font-semibold tracking-widest uppercase
          border shadow-sm transition-all duration-200 active:scale-95
          ${
            autoRefresh
              ? "bg-slate-900 dark:bg-indigo-500 text-white border-transparent shadow-indigo-500/20 dark:shadow-indigo-400/20"
              : "bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700/60 hover:border-slate-300 dark:hover:border-slate-600"
          }
        `}
      >
        <IconRefresh
          className={autoRefresh ? "animate-spin [animation-duration:2s]" : ""}
        />
        {autoRefresh ? `${countdown}s` : "Auto-refresh"}
      </button>
    </div>
  );
}
