# Blog Service Documentation

## Overview
The Blog Service (`ssrBlogService`) provides a comprehensive set of methods to interact with the blog API endpoints for server-side rendering in Next.js.

## Features

✅ **Complete Blog API Coverage** - All blog endpoints implemented  
✅ **Server-Side Rendering** - Optimized for Next.js getServerSideProps  
✅ **Type-Safe** - Full TypeScript support with interfaces  
✅ **Error Handling** - Graceful fallbacks for all methods  
✅ **Filtering & Search** - Advanced filtering, sorting, and search capabilities  
✅ **Pagination** - Built-in pagination support  
✅ **Batch Fetching** - Efficient data fetching for complex pages  
✅ **SEO Friendly** - Slug-based routing and metadata support  

---

## Installation

The service is already available in your project. Simply import it:

```typescript
import { ssrBlogService } from "@/services/ssr/blog.service";
```

---

## Quick Start

### 1. Blog List Page

```typescript
// src/pages/blog/index.tsx
import { ssrBlogService } from "@/services/ssr/blog.service";
import { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { posts, categories } = await ssrBlogService.batchFetch({
    page: 1,
    limit: 12,
  });

  return {
    props: {
      posts: posts.data || [],
      categories: categories.data || [],
      pagination: posts.meta || { page: 1, limit: 12, total: 0, pages: 0 },
    },
  };
};
```

### 2. Single Blog Post Page

```typescript
// src/pages/blog/[slug].tsx
import { ssrBlogService } from "@/services/ssr/blog.service";
import { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { slug } = context.params as { slug: string };

  const { post, relatedPosts } = await ssrBlogService.getPostPageData(slug, 3);

  if (!post.success || !post.data) {
    return { notFound: true };
  }

  return {
    props: {
      post: post.data,
      relatedPosts: relatedPosts.data || [],
    },
  };
};
```

### 3. Category Page

```typescript
// src/pages/blog/category/[slug].tsx
import { ssrBlogService } from "@/services/ssr/blog.service";
import { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { slug } = context.params as { slug: string };
  const { page } = context.query;

  const { category, posts } = await ssrBlogService.getCategoryPageData(
    slug,
    page ? parseInt(page as string) : 1,
    10
  );

  return {
    props: {
      category: category.data,
      posts: posts.data || [],
      pagination: posts.meta || { page: 1, limit: 10, total: 0, pages: 0 },
    },
  };
};
```

---

## API Methods

### Blog Posts

#### `getPosts(filters)`
Get all blog posts with filtering, search, and pagination.

**Parameters:**
```typescript
interface SSRBlogPostFilters {
  page?: number;
  limit?: number;
  sortBy?: "title" | "publishedAt" | "createdAt";
  sortOrder?: "asc" | "desc";
  search?: string;
  categoryId?: number;
  categorySlug?: string;
  tagId?: number;
  tagSlug?: string;
  tagIds?: number[];
  publishedAfter?: string;
  publishedBefore?: string;
}
```

**Examples:**
```typescript
// Get all posts (paginated)
const posts = await ssrBlogService.getPosts({ page: 1, limit: 10 });

// Filter by category
const posts = await ssrBlogService.getPosts({
  categorySlug: "technology",
  page: 1,
  limit: 10,
});

// Search posts
const posts = await ssrBlogService.getPosts({
  search: "javascript",
  page: 1,
  limit: 10,
});

// Filter by date range
const posts = await ssrBlogService.getPosts({
  publishedAfter: "2024-01-01",
  publishedBefore: "2024-12-31",
  sortBy: "publishedAt",
  sortOrder: "desc",
});

// Filter by multiple tags
const posts = await ssrBlogService.getPosts({
  tagIds: [1, 2, 3],
  page: 1,
  limit: 10,
});
```

#### `getPostBySlug(slug)`
Get a single blog post by slug (recommended for SEO).

```typescript
const post = await ssrBlogService.getPostBySlug("my-blog-post");
```

#### `getPostById(id)`
Get a single blog post by ID.

```typescript
const post = await ssrBlogService.getPostById(1);
```

#### `getRecentPosts(limit)`
Get the most recent blog posts.

```typescript
const recentPosts = await ssrBlogService.getRecentPosts(5);
```

#### `getRelatedPosts(postId, limit)`
Get related posts from the same category.

```typescript
const relatedPosts = await ssrBlogService.getRelatedPosts(1, 3);
```

#### `searchPosts(query, limit)`
Search blog posts by title, excerpt, or content.

```typescript
const results = await ssrBlogService.searchPosts("typescript", 20);
```

---

### Blog Categories

#### `getCategories()`
Get all blog categories.

```typescript
const categories = await ssrBlogService.getCategories();
```

#### `getCategoryBySlug(slug)`
Get a single category by slug.

```typescript
const category = await ssrBlogService.getCategoryBySlug("technology");
```

---

### Blog Tags

#### `getTags()`
Get all blog tags.

```typescript
const tags = await ssrBlogService.getTags();
```

#### `getTagBySlug(slug)`
Get a single tag by slug.

```typescript
const tag = await ssrBlogService.getTagBySlug("typescript");
```

---

## Batch Fetching Methods

### `batchFetch(filters)`
Fetch posts, categories, and tags in parallel.

```typescript
const { posts, categories, tags } = await ssrBlogService.batchFetch({
  page: 1,
  limit: 10,
});
```

### `getHomepageData(limit)`
Fetch data needed for blog homepage.

```typescript
const { recentPosts, categories } = await ssrBlogService.getHomepageData(6);
```

### `getCategoryPageData(categorySlug, page, limit)`
Fetch data needed for category page.

```typescript
const { category, posts } = await ssrBlogService.getCategoryPageData(
  "technology",
  1,
  10
);
```

### `getTagPageData(tagSlug, page, limit)`
Fetch data needed for tag page.

```typescript
const { tag, posts } = await ssrBlogService.getTagPageData(
  "typescript",
  1,
  10
);
```

### `getPostPageData(slug, relatedLimit)`
Fetch data needed for single blog post page.

```typescript
const { post, relatedPosts } = await ssrBlogService.getPostPageData(
  "my-blog-post",
  3
);
```

---

## Response Types

### SSRBlogPostResponse
```typescript
interface SSRBlogPostResponse {
  success: boolean;
  message: string;
  data: BlogPost[];
  meta?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}
```

### SSRBlogPostDetailResponse
```typescript
interface SSRBlogPostDetailResponse {
  success: boolean;
  message: string;
  data: BlogPost;
}
```

### SSRBlogCategoryResponse
```typescript
interface SSRBlogCategoryResponse {
  success: boolean;
  message: string;
  data: BlogCategory[];
}
```

### SSRBlogTagResponse
```typescript
interface SSRBlogTagResponse {
  success: boolean;
  message: string;
  data: BlogTag[];
}
```

---

## Error Handling

All methods include automatic error handling with fallback data:

```typescript
const posts = await ssrBlogService.getPosts({ page: 1, limit: 10 });

// If error occurs, returns:
// {
//   success: false,
//   message: "Failed to fetch blog posts",
//   data: [],
//   meta: { page: 1, limit: 10, total: 0, pages: 0 }
// }
```

---

## Common Use Cases

### 1. Blog Homepage
```typescript
export const getServerSideProps: GetServerSideProps = async () => {
  const { recentPosts, categories } = await ssrBlogService.getHomepageData(6);

  return {
    props: {
      posts: recentPosts.data || [],
      categories: categories.data || [],
    },
  };
};
```

### 2. Search Page
```typescript
export const getServerSideProps: GetServerSideProps = async (context) => {
  const { q } = context.query;
  
  const results = await ssrBlogService.searchPosts(q as string, 20);

  return {
    props: {
      query: q,
      results: results.data || [],
    },
  };
};
```

### 3. Archive Page
```typescript
export const getServerSideProps: GetServerSideProps = async (context) => {
  const { year, month } = context.query;

  const posts = await ssrBlogService.getPosts({
    publishedAfter: `${year}-${month}-01`,
    publishedBefore: `${year}-${month}-31`,
    page: 1,
    limit: 20,
  });

  return {
    props: {
      posts: posts.data || [],
      year,
      month,
    },
  };
};
```

---

## Notes

- All methods are designed for server-side use only (getServerSideProps)
- All endpoints return only published blog posts
- Comments are filtered to show only approved comments
- Slug-based routes are recommended for SEO
- Dates should be in ISO 8601 format (e.g., "2024-01-15T10:00:00Z")

---

## Files Created

1. **Service**: `src/services/ssr/blog.service.ts`
2. **Blog List Page**: `src/pages/blog/index.tsx`
3. **Blog Detail Page**: `src/pages/blog/[slug].tsx`
4. **This Documentation**: `src/services/ssr/BLOG_SERVICE_README.md`

---

## Support

For API endpoint details, refer to: `d:\projects\cms\server\BLOG_API_DOCUMENTATION.md`


