/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ["dev.jackjona.com"],

  async rewrites() {
    return [
      {
        source: "/adsb/:path*",
        destination: "https://opendata.adsb.fi/:path*",
      },
      {
        source: "/jetapi/:path*",
        destination: "https://www.jetapi.dev/:path*",
      },
    ];
  },
};

export default nextConfig;
