import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import rawSlugs from "./src/slugs.json";

const canonicalSlug = (value: string | undefined): string => {
  if (!value) return "";
  const trimmed = value.trim();
  if (!trimmed) return "";
  const withLeadingSlash = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  if (withLeadingSlash === "/") return "/";
  return withLeadingSlash.endsWith("/")
    ? withLeadingSlash.slice(0, -1)
    : withLeadingSlash;
};

const normalizeDestination = (value: string | undefined): string => {
  if (!value) return "";
  const trimmed = value.trim();
  if (!trimmed) return "";
  return trimmed.startsWith("/") || trimmed.startsWith("http")
    ? trimmed
    : `/${trimmed}`;
};

const PRIVATE_PATH_PREFIXES = [
  "/auth",
  "/profile",
  "/admin",
  "/cart/checkout",
  "/cart/user-info",
];

const isPrivatePath = (pathname: string): boolean =>
  PRIVATE_PATH_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );

const slugRedirects = new Map<string, string>();

Object.entries(rawSlugs).forEach(([from, to]) => {
  const inputPath = canonicalSlug(from);
  const destination = normalizeDestination(to);

  if (!inputPath || !destination) {
    return;
  }

  slugRedirects.set(inputPath, destination);

  if (inputPath !== "/" && !inputPath.endsWith("/")) {
    slugRedirects.set(`${inputPath}/`, destination);
  }
});

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const inputPath = canonicalSlug(pathname);

  const destination = inputPath && slugRedirects.get(inputPath);

  if (destination) {
    const redirectUrl = new URL(destination, request.url);

    // Preserve any incoming query parameters unless the destination already
    // defines them explicitly.
    request.nextUrl.searchParams.forEach((value, key) => {
      if (!redirectUrl.searchParams.has(key)) {
        redirectUrl.searchParams.append(key, value);
      }
    });

    return NextResponse.redirect(redirectUrl);
  }

  const response = NextResponse.next();

  if (isPrivatePath(pathname)) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Only run the redirect logic for page and non-static asset routes, since
     * Next.js automatically handles `/_next`, `api`, and static files.
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};

