"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function FlightDetails({ flightNumber }) {
  const [isLoading, setIsLoading] = useState(true);
  const [flightInfo, setFlightInfo] = useState(null);

  useEffect(() => {
    async function getFlightInfo() {
      const res = await fetch(
        `https://api.adsbdb.com/v0/callsign/${flightNumber}`
      );
      const data = await res.json();
      setFlightInfo(data);
      setIsLoading(false);
    }

    getFlightInfo();
  }, [flightNumber]);
  return (
    <div className="mx-12 my-4">
      {isLoading && (
        <div
          role="status"
          aria-live="polite"
          className="p-2 w-full mx-auto animate-pulse h-32 bg-gray-300 rounded-xl flex items-center justify-center"
        >
          <span className="sr-only">Loading flight details...</span>
        </div>
      )}

      {!isLoading && flightInfo && flightInfo.response.flightroute ? (
        <div
          id="flightRoute"
          className="flex flex-row w-full p-4 border-4 rounded-2xl justify-around items-center"
        >
          <div id="origin">
            <h2 className="font-bold text-2xl pb-1">Origin:</h2>
            <p>{flightInfo.response.flightroute.origin.iata_code}</p>
            <p>{flightInfo.response.flightroute.origin.name}</p>
            <p>
              {flightInfo.response.flightroute.origin.municipality},{" "}
              {flightInfo.response.flightroute.origin.country_name}
            </p>
          </div>
          <div>
            <Image
              src="/arrow.svg"
              alt="Right Arrow logo"
              width={32}
              height={32}
              priority
            />
          </div>

          <div id="destination">
            <h2 className="font-bold text-2xl pb-1">Destination:</h2>
            <p>{flightInfo.response.flightroute.destination.iata_code}</p>
            <p>{flightInfo.response.flightroute.destination.name}</p>
            <p>
              {flightInfo.response.flightroute.destination.municipality},{" "}
              {flightInfo.response.flightroute.destination.country_name}
            </p>
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
