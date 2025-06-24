export default function SkeletonLoader({ customClasses = "p-2 w-32 w-full" }) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className={`${customClasses} mx-auto animate-pulse bg-gray-300 rounded-xl flex items-center justify-center`}
    >
      <span className="sr-only" aria-atomic="true">
        Loading flight details...
      </span>
    </div>
  );
}
