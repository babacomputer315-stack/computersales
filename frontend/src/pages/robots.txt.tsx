import { siteUrl } from "@/utils/constants";
import { GetServerSideProps } from "next";

/**
 * Generate robots.txt content
 */
function generateRobotsTxt(baseUrl: string): string {
  return `# *
User-agent: *
Allow: /

# Block bad bots
User-agent: MJ12bot
Disallow: /

User-agent: AhrefsBot
Disallow: /

User-agent: SemrushBot
Crawl-delay: 10

# Google bots
User-agent: Googlebot
Allow: /
Crawl-delay: 0

User-agent: Googlebot-Image
Allow: /

# Bing bot
User-agent: Bingbot
Allow: /
Crawl-delay: 1

# Yandex bot
User-agent: Yandex
Allow: /
Crawl-delay: 2

# Sitemap location
Sitemap: ${baseUrl}/sitemap.xml
`;
}

export const getServerSideProps: GetServerSideProps = async ({ res, req }) => {
  // Get base URL from environment or request headers
  const baseUrl = siteUrl || "";

  // Generate robots.txt content
  const robotsTxt = generateRobotsTxt(baseUrl);

  // Set response headers
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=86400, stale-while-revalidate=604800"
  );

  // Write and end response
  res.write(robotsTxt);
  res.end();

  return { props: {} };
};

/**
 * Empty component - robots.txt is generated server-side only
 */
export default function RobotsTxt() {
  return null;
}
