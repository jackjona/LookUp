"use client";

import { useEffect, useState } from "react";
import SkeletonLoader from "@/components/SkeletonLoader";

export default function PlaneImage({ registration }) {
  const [error, setError] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    async function fetchImage() {
      setFetching(true);
      setError(false); // Refresh the error state
      try {
        const res = await fetch(
          `https://corsproxy.io/?url=https://www.jetapi.dev/api?reg=${registration}&photos=1&only_jp=true`
        );
        const data = await res.json();
        setImageUrl(data.Images[0]?.Image);
      } catch (error) {
        setError(true);
        console.error("Error loading plane image");
      } finally {
        setFetching(false);
      }
    }

    fetchImage();
  }, [registration]);

  const isLoading = fetching || !imgLoaded;

  return (
    <div
      className="relative w-full h-auto"
      aria-busy={isLoading}
      aria-live="polite"
    >
      {!error && isLoading && (
        <SkeletonLoader customClasses="p-2 w-90 h-60 m-4" />
      )}
      {imageUrl && (
        <img
          src={imageUrl}
          alt={`Photograph of airplane with the registration ${registration}`}
          onLoad={() => setImgLoaded(true)}
          className={`${isLoading ? "hidden" : "block"} mx-auto rounded-lg m-4`}
          width="350"
          height="250"
        />
      )}
      {error && !isLoading && (
        <img
          src="/placeholder.svg"
          className={"mx-auto rounded-lg m-4"}
          width="350"
          height="250"
          aria-hidden="true"
        />
      )}
    </div>
  );
}
