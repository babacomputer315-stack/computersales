// export const imageBaseUrl = "https://computersales.storage.c2.liara.space";
export const imageBaseUrl = "https://storage.computersales.ir";

const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;
const isLocalSiteUrl = configuredSiteUrl === "http://localhost:3000" || configuredSiteUrl === "http://127.0.0.1:3000";

export const siteUrl =
  (configuredSiteUrl && !isLocalSiteUrl ? configuredSiteUrl : undefined) ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");
