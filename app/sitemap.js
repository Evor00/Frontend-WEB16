const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export default function sitemap() {
  const rutas = ["", "/login", "/register"];

  return rutas.map((ruta) => ({
    url: `${SITE_URL}${ruta}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: ruta === "" ? 1 : 0.6,
  }));
}
