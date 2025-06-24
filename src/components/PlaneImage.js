"use client";

import { useEffect, useState } from "react";
import SkeletonLoader from "@/components/SkeletonLoader";

export default function PlaneImage({ registration }) {
  const [imageUrl, setImageUrl] = useState(null);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    async function fetchImage() {
      setFetching(true);
      try {
        const res = await fetch(
          `https://corsproxy.io/?url=https://www.jetapi.dev/api?reg=${registration}&photos=1&only_jp=true`
        );
        const data = await res.json();
        setImageUrl(data.Images[0]?.Image);
        console.log(data.Images[0].Image);
      } catch (error) {
        console.error("Failed to fetch image", error);
      } finally {
        setFetching(false);
      }
    }

    fetchImage();
  }, [registration]);

  const isLoading = fetching || !imgLoaded;

  return (
    <div className="relative w-full h-auto">
      {isLoading && <SkeletonLoader customClasses="p-2 w-90 h-60 m-4" />}
      {imageUrl && (
        <img
          src={imageUrl}
          alt={`Image of Plane ${registration}`}
          onLoad={() => setImgLoaded(true)}
          className={`${isLoading ? "hidden" : "block"} mx-auto rounded-lg m-4`}
          width="350px"
          height="250px"
        />
      )}
    </div>
  );
}
