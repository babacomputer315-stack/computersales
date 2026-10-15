import { GetServerSideProps } from "next";
import { ssrProductService } from "../services/ssr/product.service";
import { ssrCategoryService } from "../services/ssr/category.service";
import { Product } from "../types/product";
import { Category } from "../services/user/product.service";
import { siteUrl } from "@/utils/constants";

/**
 * Sitemap URL entry interface
 */
interface SitemapUrl {
  loc: string;
  lastmod: string;
  changefreq:
  | "always"
  | "hourly"
  | "daily"
  | "weekly"
  | "monthly"
  | "yearly"
  | "never";
  priority: string;
}

/**
 * Convert date to ISO string format
 */
function toISO(dateLike?: string | Date | null): string {
  try {
    if (!dateLike) return new Date().toISOString();
    return new Date(dateLike).toISOString();
  } catch {
    return new Date().toISOString();
  }
}

/**
 * Escape XML special characters
 */
function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/**
 * Flatten category tree to get all category slugs
 */
function flattenCategories(categories: Category[]): Category[] {
  const result: Category[] = [];

  function traverse(cats: Category[]) {
    cats.forEach((cat) => {
      result.push(cat);
      if (cat.children && cat.children.length > 0) {
        traverse(cat.children);
      }
    });
  }

  traverse(categories);
  return result;
}

/**
 * Generate complete sitemap XML
 */
function generateSitemap(urls: SitemapUrl[]): string {
  const urlset = urls
    .map(
      (url) => `  <url>
    <loc>${escapeXml(url.loc)}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urlset}
</urlset>`;
}

/**
 * Fetch all products for sitemap (paginated)
 */
async function fetchAllProducts(): Promise<Product[]> {
  const allProducts: Product[] = [];
  let page = 1;
  const limit = 100; // Fetch 100 products per page

  try {
    // Fetch first page to get total count
    const firstResponse = await ssrProductService.getProducts({
      page: 1,
      limit,
      sortBy: "createdAt",
      sortOrder: "desc",
    });

    if (firstResponse.success && firstResponse.data?.data) {
      allProducts.push(...firstResponse.data.data);

      // Calculate total pages
      const totalPages = firstResponse.meta?.pages || 1;

      // Fetch remaining pages
      if (totalPages > 1) {
        const remainingPages = Array.from(
          { length: totalPages - 1 },
          (_, i) => i + 2
        );

        const remainingResponses = await Promise.all(
          remainingPages.map((p) =>
            ssrProductService.getProducts({
              page: p,
              limit,
              sortBy: "createdAt",
              sortOrder: "desc",
            })
          )
        );

        remainingResponses.forEach((response) => {
          if (response.success && response.data?.data) {
            allProducts.push(...response.data.data);
          }
        });
      }
    }
  } catch (error) {
    console.error("Error fetching products for sitemap:", error);
  }

  return allProducts;
}

/**
 * Fetch all categories for sitemap
 */
async function fetchAllCategories(): Promise<Category[]> {
  try {
    const response = await ssrCategoryService.getCategories();

    if (response.success && response.data) {
      // Handle both array and single object responses
      const categories = Array.isArray(response.data)
        ? response.data
        : [response.data];
      return flattenCategories(categories);
    }
  } catch (error) {
    console.error("Error fetching categories for sitemap:", error);
  }

  return [];
}

export const getServerSideProps: GetServerSideProps = async ({ res, req }) => {
  // Get base URL from environment or request headers
  const baseUrl = siteUrl || "";

  const urls: SitemapUrl[] = [];

  // Static pages with their priorities and change frequencies
  const staticPages = [
    { path: "/", priority: "1.0", changefreq: "daily" as const },
    { path: "/about-us", priority: "0.8", changefreq: "monthly" as const },
    { path: "/contact", priority: "0.8", changefreq: "monthly" as const },
    { path: "/categories", priority: "0.9", changefreq: "weekly" as const },
    { path: "/blog", priority: "0.8", changefreq: "daily" as const },
  ];

  // Add static pages
  staticPages.forEach((page) => {
    urls.push({
      loc: `${baseUrl}${page.path}`,
      lastmod: toISO(),
      changefreq: page.changefreq,
      priority: page.priority,
    });
  });

  try {
    // Fetch dynamic data in parallel
    const [products, categories] = await Promise.all([
      fetchAllProducts(),
      fetchAllCategories(),
    ]);

    // Add product pages
    products.forEach((product) => {
      if (product.slug && product.isPublished) {
        urls.push({
          loc: `${baseUrl}/products/${product.slug}`,
          lastmod: toISO(product.updatedAt || product.createdAt),
          changefreq: "weekly",
          priority: "0.8",
        });
      }
    });

    // Add category pages
    categories.forEach((category) => {
      if (category.slug) {
        urls.push({
          loc: `${baseUrl}/products/category/${category.slug}`,
          lastmod: toISO(), // Categories don't have updatedAt in this type
          changefreq: "weekly",
          priority: "0.7",
        });
      }
    });

    console.log(
      `✅ Sitemap generated: ${urls.length} URLs (${products.length} products, ${categories.length} categories)`
    );
  } catch (error) {
    console.error("❌ Error generating sitemap:", error);
  }

  // Generate sitemap XML
  const sitemap = generateSitemap(urls);

  // Set response headers
  res.setHeader("Content-Type", "text/xml; charset=utf-8");
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=3600, stale-while-revalidate=86400"
  );

  // Write and end response
  res.write(sitemap);
  res.end();

  return { props: {} };
};

/**
 * Empty component - sitemap is generated server-side only
 */
export default function Sitemap() {
  return null;
}
