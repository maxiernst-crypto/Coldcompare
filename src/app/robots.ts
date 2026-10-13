import type { MetadataRoute } from "next";
import { absolute } from "@/lib/site";
import { isPreviewMode } from "@/lib/visibility";

export default function robots(): MetadataRoute.Robots {
  if (isPreviewMode()) return { rules: [{ userAgent: "*", disallow: "/" }] };
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/api", "/go/"] }],
    sitemap: absolute("/sitemap.xml"),
  };
}
