interface QueryOptions {
  page?: number;
  limit?: number;
  includePagination?: boolean;
  filters?: Record<string, any>;
}

export function buildQueryString({
  page = 1,
  limit = 20,
  includePagination = true,
  filters = {},
}: QueryOptions): string {
  const currentParams = new URLSearchParams(window.location.search);

  if (includePagination) {
    currentParams.set("page", String(page));
    currentParams.set("limit", String(limit));
  }

  for (const [key, value] of Object.entries(filters)) {
    if (
      value !== undefined &&
      value !== "undefined" &&
      value !== null &&
      value !== ""
    ) {
      currentParams.set(key, String(value));
    } else {
      currentParams.delete(key);
    }
  }
  return currentParams.toString();
}
