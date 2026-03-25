import { FlightField } from "./CoordInput";
import FlightRoute from "@/components/FlightRoute";
import PlaneImage from "@/components/PlaneImage";

export default function FlightList({ flights }) {
  if (!flights) return null;

  const [topFlight, ...otherFlights] = flights.aircraft ?? [];

  if (flights.resultCount === 0) {
    return (
      <h2 className="text-2xl">There are currently no planes above you.</h2>
    );
  }

  return (
    <div className="pb-20">
      {topFlight && <TopFlight flight={topFlight} />}
      {otherFlights.length > 0 && <NearbyFlights flights={otherFlights} />}
    </div>
  );
}

function TopFlight({ flight }) {
  return (
    <div>
      {flight.r && <PlaneImage registration={flight.r} />}
      <h2 className="text-2xl font-semibold mb-2">Flight Details</h2>
      <FlightField label="Flight Number" value={flight.flight} />
      <FlightField
        label="Plane"
        value={
          flight.t && `${flight.t}${flight.desc ? ` (${flight.desc})` : ""}`
        }
      />
      <FlightField label="Operator" value={flight.ownOp} />
      <FlightField
        label="Altitude"
        value={flight.alt_baro && `${flight.alt_baro} ft`}
      />
      <FlightField label="Year" value={flight.year} />
      {flight.flight && <FlightRoute flightNumber={flight.flight} />}
    </div>
  );
}

function NearbyFlights({ flights }) {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Other Flights Nearby</h2>
      {flights.map((plane, i) => (
        <div key={i} className="mb-4">
          <FlightField label="Flight Number" value={plane.flight} />
          <FlightField
            label="Plane"
            value={
              plane.t && `${plane.t}${plane.desc ? ` (${plane.desc})` : ""}`
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
  );
}
