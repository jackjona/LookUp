export async function GET() {
  const res = await fetch(`https://ipinfo.io/json`);
  if (!res.ok) return new Response("GeoIP failed", { status: 500 });

  const data = await res.json();
  const [lat, lon] = data.loc.split(",");

  return Response.json({
    lat: Number(lat).toFixed(4),
    lon: Number(lon).toFixed(4),
  });
}
