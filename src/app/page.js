import FlightDetails from "@/components/FlightDetails";

export default async function Home() {
  return (
    <>
      <main className="min-h-screen flex flex-col justify-center text-center">
        <h1 className="text-7xl font-extrabold">LookUp</h1>
        <br />
        <FlightDetails />
      </main>
    </>
  );
}
