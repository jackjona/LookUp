"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import SkeletonLoader from "./SkeletonLoader";

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

  const route = flightInfo?.response?.flightroute;

  return (
    <section
      id="flightRoute"
      aria-labelledby="flightRouteHeading"
      className="mx-12 my-4"
      role="region"
    >
      {isLoading && (
        <SkeletonLoader
          customClasses="p-2 h-32 w-full"
          aria-busy="true"
          aria-label="Loading flight route information"
        />
      )}

      {!isLoading && route ? (
        <div
          id="flightRoute"
          className="flex flex-row w-full p-4 border-4 rounded-2xl justify-around items-center bg-black/10 dark:bg-white/10"
        >
          <div id="origin" aria-labelledby="originHeading">
            <h2 id="originHeading" className="font-bold text-2xl pb-1">
              Origin:
            </h2>
            <p>{route.origin.iata_code}</p>
            <p>{route.origin.name}</p>
            <p>
              {route.origin.municipality}, {route.origin.country_name}
            </p>
          </div>

          <div aria-hidden="true">
            <Image src="/arrow.svg" alt="" width={32} height={32} priority />
          </div>

          <div id="destination" aria-labelledby="destinationHeading">
            <h2 id="destinationHeading" className="font-bold text-2xl pb-1">
              Destination:
            </h2>
            <p>{route.destination.iata_code}</p>
            <p>{route.destination.name}</p>
            <p>
              {route.destination.municipality}, {route.destination.country_name}
            </p>
          </div>
        </div>
      ) : null}
    </section>
  );
}
