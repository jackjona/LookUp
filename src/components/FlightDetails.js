"use client";

import { useEffect, useState } from "react";
import FlightRoute from "@/components/FlightRoute";
import PlaneImage from "@/components/PlaneImage";

export default function FlightDetails({ coordinates }) {
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [flights, setFlights] = useState(null);

  useEffect(() => {
    async function getFlights() {
      try {
        const res = await fetch(
          "https://corsproxy.io/?url=https://opendata.adsb.fi/api/v2/lat/43.85/lon/-79.530/dist/10",
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
    }

    getFlights();
  }, []);

  return (
    <div id="flightDetails">
      {/* Check if there is a flight nearby */}
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
              <span className="font-bold">Plane:</span> {flights.aircraft[0].t}{" "}
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
      {error ||
        (flights?.aircraft?.length <= 0 && (
          <div id="noPlane">
            <h2 className="text-2xl">
              There are currently no planes flying above you.
            </h2>
          </div>
        ))}
      <br />
      {/* Check if there is more than 1 flight nearby, if true then map over the results */}
      {flights?.aircraft?.length > 1 && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Other Flights Nearby</h2>
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
  );
}
