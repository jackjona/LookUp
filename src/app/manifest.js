export default function manifest() {
  return {
    name: "LookUp",
    short_name: "LookUp",
    description:
      "A simple website that identifies the plane flying above you in real time with flight number, aircraft details, origin, and destination.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#000000",
    icons: [
      {
        src: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
