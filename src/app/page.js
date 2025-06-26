import FlightDetails from "@/components/FlightDetails";

export default async function Home() {
  return (
    <>
      <main className="min-h-screen flex flex-col justify-center text-center">
        <h1 className="text-7xl font-extrabold">LookUp</h1>
        <br />
        <FlightDetails />
      </main>
      <footer className="w-full text-center py-6 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-600 dark:text-gray-400">
        <div className="container mx-auto px-4">
          <a
            href="https://github.com/jackjona/lookup"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-block hover:underline text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200"
          >
            View on GitHub
          </a>
        </div>
      </footer>
    </>
  );
}
