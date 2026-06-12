"use client";
import FlightRoute from "@/components/FlightRoute";
import PlaneImage from "@/components/PlaneImage";

function fmtAlt(alt) {
  if (alt == null) return null;
  return Number(alt).toLocaleString();
}

function fmtSpeed(gs) {
  if (!gs) return null;
  return `${Math.round(gs)} kts`;
}

function fmtFlight(flight) {
  return flight?.trim() || null;
}

function StatTile({ label, value }) {
  if (!value) return null;
  return (
    <div className="flex flex-col gap-1 min-w-0">
      <span className="font-mono text-[10px] font-semibold tracking-widest uppercase text-indigo-500/70 dark:text-indigo-400/60 whitespace-nowrap">
        {label}
      </span>
      <span className="font-mono text-[13px] font-medium text-slate-800 dark:text-slate-100 truncate">
        {value}
      </span>
    </div>
  );
}

function TopFlightCard({ flight }) {
  const flightNo = fmtFlight(flight.flight);
  const subtitle = [flight.ownOp, flight.desc].filter(Boolean).join(" · ");

  return (
    <div
      id="currentFlightCard"
      className="
        relative overflow-hidden rounded-2xl
        border border-slate-200 dark:border-slate-700/50
        bg-white dark:bg-gradient-to-br dark:from-slate-900 dark:via-slate-900 dark:to-slate-800
        shadow-sm dark:shadow-none
        transition-all duration-300
        hover:border-indigo-300/50 dark:hover:border-indigo-500/30
        hover:shadow-md dark:hover:shadow-[0_0_40px_rgba(56,189,248,0.08)]
      "
      style={{ animation: "fadeSlideIn 0.4s ease both" }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.015] dark:opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(#38bdf8 1px, transparent 1px), linear-gradient(90deg, #38bdf8 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
        aria-hidden="true"
      />

      {flight.r && (
        <div className="relative w-full aspect-[16/8] bg-slate-100 dark:bg-slate-800/60 overflow-hidden">
          <PlaneImage registration={flight.r} />
        </div>
      )}

      <div className="relative flex items-start justify-between px-5 pt-4 pb-3 gap-3">
        <div className="min-w-0">
          {subtitle && (
            <p className="font-mono text-[10px] font-semibold tracking-widest uppercase text-indigo-500/70 dark:text-indigo-400/60 mb-1.5 truncate">
              {subtitle}
            </p>
          )}
          <p className="font-mono text-[26px] font-bold tracking-tight text-slate-900 dark:text-white leading-none">
            {flightNo ?? "—"}
          </p>
        </div>

        {flight.alt_baro != null && (
          <div className="flex-shrink-0 text-right">
            <p className="font-mono text-[26px] font-bold tracking-tight text-slate-900 dark:text-white leading-none">
              {fmtAlt(flight.alt_baro)}
            </p>
            <p className="font-mono text-[10px] font-semibold tracking-widest uppercase text-indigo-500/70 dark:text-indigo-400/60 mt-1">
              ft
            </p>
          </div>
        )}
      </div>

      {flightNo && (
        <div className="relative border-t border-slate-100 dark:border-slate-700/40">
          <FlightRoute flightNumber={flightNo} />
        </div>
      )}

      <div className="relative flex justify-center divide-x divide-slate-100 dark:divide-slate-700/40 px-5 py-3.5 overflow-x-auto border-t border-slate-100 dark:border-slate-700/40">
        {flight.t && (
          <div className="pr-5 flex-shrink-0">
            <StatTile label="Aircraft" value={flight.t} />
          </div>
        )}
        {flight.r && (
          <div className="px-5 flex-shrink-0">
            <StatTile label="Reg." value={flight.r} />
          </div>
        )}
        {flight.gs && (
          <div className="px-5 flex-shrink-0">
            <StatTile label="Speed" value={fmtSpeed(flight.gs)} />
          </div>
        )}
        {flight.year && (
          <div className="pl-5 flex-shrink-0">
            <StatTile label="Year" value={flight.year} />
          </div>
        )}
      </div>
    </div>
  );
}

function NearbyFlights({ flights }) {
  return (
    <section id="nearbyFlightSection">
      <div className="flex items-center gap-3 px-1 mb-2.5">
        <span className="font-mono text-[10px] font-semibold tracking-widest uppercase text-indigo-500/70 dark:text-indigo-400/60">
          Nearby
        </span>
        <span className="font-mono text-[10px] font-semibold tracking-widest text-slate-400 dark:text-slate-600">
          {flights.length}
        </span>
        <div className="flex-1 h-px bg-slate-100 dark:bg-slate-800" />
      </div>

      <div
        className="
          relative overflow-hidden rounded-2xl
          border border-slate-200 dark:border-slate-700/50
          bg-white dark:bg-slate-900/60
          divide-y divide-slate-100 dark:divide-slate-800/60
        "
      >
        {flights.map((plane, i) => (
          <div
            key={plane.hex ?? i}
            className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors duration-150"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0 shadow-[0_0_4px_#34d399]" />
            <div className="flex-1 min-w-0 flex items-baseline gap-2.5">
              <span className="font-mono text-[13px] font-bold text-slate-800 dark:text-slate-100 tracking-wide">
                {fmtFlight(plane.flight) ?? "—"}
              </span>
              {(plane.ownOp || plane.t) && (
                <span className="font-mono text-[11px] text-slate-400 dark:text-slate-500 truncate">
                  {[plane.ownOp, plane.t].filter(Boolean).join(" · ")}
                </span>
              )}
            </div>
            {plane.alt_baro != null && (
              <span className="font-mono text-[12px] text-slate-400 dark:text-slate-500 flex-shrink-0 tabular-nums">
                {fmtAlt(plane.alt_baro)}{" "}
                <span className="text-[10px] text-slate-300 dark:text-slate-600 tracking-widest uppercase">
                  ft
                </span>
              </span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
// No planes
function EmptyState() {
  return (
    <div
      id="noPlanesState"
      className="flex flex-col items-center gap-4 py-20 text-center"
    >
      <div className="w-12 h-12 rounded-full border border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-800/40 flex items-center justify-center text-slate-300 dark:text-slate-600">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M5 17.5L19 12L5 6.5V10.5L15 12L5 13.5V17.5Z" />
        </svg>
      </div>
      <div>
        <p className="font-mono text-[10px] font-semibold tracking-widest uppercase text-indigo-500/60 dark:text-indigo-400/50 mb-1.5">
          Clear skies
        </p>
        <p className="text-[13px] text-slate-400 dark:text-slate-500">
          No aircraft overhead right now
        </p>
      </div>
    </div>
  );
}

export default function FlightList({ flights }) {
  if (!flights) return null;

  const [topFlight, ...otherFlights] = flights.aircraft ?? [];

  if (flights.resultCount === 0) return <EmptyState />;

  return (
    <div className="flex flex-col gap-5">
      {topFlight && <TopFlightCard flight={topFlight} />}
      {otherFlights.length > 0 && <NearbyFlights flights={otherFlights} />}

      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
