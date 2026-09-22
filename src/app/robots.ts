import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://neuronyx.aiktc.ac.in";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/", "/forms/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
