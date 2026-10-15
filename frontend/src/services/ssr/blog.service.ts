/**
 * Blog Service for Server-Side Rendering (SSR)
 * 
 * This service provides methods to interact with the blog API endpoints.
 * All methods are designed to work with Next.js getServerSideProps.
 * 
 * @example Basic Usage
 * ```typescript
 * // In a page component with getServerSideProps
 * import { ssrBlogService } from "@/services/ssr/blog.service";
 * 
 * export const getServerSideProps: GetServerSideProps = async (context) => {
 *   const posts = await ssrBlogService.getPosts({ page: 1, limit: 10 });
 *   return { props: { posts: posts.data || [] } };
 * };
 * ```
 * 
 * @example Get Posts with Filters
 * ```typescript
 * // Get posts by category
 * const posts = await ssrBlogService.getPosts({
 *   categorySlug: 'technology',
 *   page: 1,
 *   limit: 10
 * });
 * 
 * // Get posts by tag
 * const posts = await ssrBlogService.getPosts({
 *   tagSlug: 'typescript',
 *   page: 1,
 *   limit: 10
 * });
 * 
 * // Search posts
 * const posts = await ssrBlogService.getPosts({
 *   search: 'javascript',
 *   page: 1,
 *   limit: 10
 * });
 * 
 * // Get posts with date range
 * const posts = await ssrBlogService.getPosts({
 *   publishedAfter: '2024-01-01',
 *   publishedBefore: '2024-12-31',
 *   sortBy: 'publishedAt',
 *   sortOrder: 'desc'
 * });
 * ```
 * 
 * @example Get Single Post
 * ```typescript
 * // Get post by slug (recommended for SEO)
 * const post = await ssrBlogService.getPostBySlug('my-blog-post');
 * 
 * // Get post by ID
 * const post = await ssrBlogService.getPostById(1);
 * ```
 * 
 * @example Get Related Posts
 * ```typescript
 * const relatedPosts = await ssrBlogService.getRelatedPosts(postId, 3);
 * ```
 * 
 * @example Batch Fetch for Homepage
 * ```typescript
 * const { recentPosts, categories } = await ssrBlogService.getHomepageData(6);
 * ```
 * 
 * @example Category Page
 * ```typescript
 * const { category, posts } = await ssrBlogService.getCategoryPageData(
 *   'technology',
 *   1, // page
 *   10 // limit
 * );
 * ```
 * 
 * @example Single Post Page with Related Posts
 * ```typescript
 * const { post, relatedPosts } = await ssrBlogService.getPostPageData(
 *   'my-blog-post-slug',
 *   3 // number of related posts
 * );
 * ```
 */

import BlogPost from "@/types/blog";
import BlogCategory from "@/types/blogCategory";
import BlogTag from "@/types/blogTag";
import { ssrHttpHelpers, SSRResponse } from "../ssrHttpClient";

// Blog response types
export interface SSRBlogPostResponse extends SSRResponse<BlogPost[]> {
  meta?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface SSRBlogPostDetailResponse extends SSRResponse<BlogPost> {}

export interface SSRBlogCategoryResponse extends SSRResponse<BlogCategory[]> {}

export interface SSRBlogCategoryDetailResponse
  extends SSRResponse<BlogCategory> {}

export interface SSRBlogTagResponse extends SSRResponse<BlogTag[]> {}

export interface SSRBlogTagDetailResponse extends SSRResponse<BlogTag> {}

// Filter interface for blog posts
export interface SSRBlogPostFilters {
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

class SSRBlogService {
  // ==================== Blog Posts Endpoints ====================

  /**
   * Get all blog posts with advanced filtering, search, and pagination
   * @param filters - Filter options for blog posts
   * @returns Promise with paginated blog posts
   */
  async getPosts(
    filters: SSRBlogPostFilters = {}
  ): Promise<SSRBlogPostResponse> {
    try {
      const params = this.buildFilterParams(filters);
      const url = ssrHttpHelpers.createUrl("/user/blog/posts", params);
      return await ssrHttpHelpers.get<SSRBlogPostResponse>(url);
    } catch (error) {
      return ssrHttpHelpers.handleError(error, {
        success: false,
        message: "Failed to fetch blog posts",
        data: [],
        meta: {
          page: filters.page || 1,
          limit: filters.limit || 10,
          total: 0,
          pages: 0,
        },
      });
    }
  }

  /**
   * Get a single blog post by ID
   * @param id - Blog post ID
   * @returns Promise with blog post details
   */
  async getPostById(id: number): Promise<SSRBlogPostDetailResponse> {
    try {
      return await ssrHttpHelpers.get<SSRBlogPostDetailResponse>(
        `/user/blog/posts/${id}`
      );
    } catch (error) {
      return ssrHttpHelpers.handleError(error, {
        success: false,
        message: "Failed to fetch blog post",
        data: null,
      });
    }
  }

  /**
   * Get a single blog post by slug
   * @param slug - Blog post slug
   * @returns Promise with blog post details
   */
  async getPostBySlug(slug: string): Promise<SSRBlogPostDetailResponse> {
    try {
      return await ssrHttpHelpers.get<SSRBlogPostDetailResponse>(
        `/user/blog/posts/slug/${slug}`
      );
    } catch (error) {
      return ssrHttpHelpers.handleError(error, {
        success: false,
        message: "Failed to fetch blog post",
        data: null,
      });
    }
  }

  /**
   * Get recent blog posts
   * @param limit - Number of posts to return (default: 5)
   * @returns Promise with recent blog posts
   */
  async getRecentPosts(limit: number = 5): Promise<SSRBlogPostResponse> {
    try {
      const url = ssrHttpHelpers.createUrl("/user/blog/posts/recent", {
        limit,
      });
      return await ssrHttpHelpers.get<SSRBlogPostResponse>(url);
    } catch (error) {
      return ssrHttpHelpers.handleError(error, {
        success: false,
        message: "Failed to fetch recent blog posts",
        data: [],
      });
    }
  }

  /**
   * Get related blog posts (from the same category)
   * @param postId - Blog post ID
   * @param limit - Number of related posts to return (default: 5)
   * @returns Promise with related blog posts
   */
  async getRelatedPosts(
    postId: number,
    limit: number = 5
  ): Promise<SSRBlogPostResponse> {
    try {
      const url = ssrHttpHelpers.createUrl(
        `/user/blog/posts/${postId}/related`,
        { limit }
      );
      return await ssrHttpHelpers.get<SSRBlogPostResponse>(url);
    } catch (error) {
      return ssrHttpHelpers.handleError(error, {
        success: false,
        message: "Failed to fetch related blog posts",
        data: [],
      });
    }
  }

  /**
   * Search blog posts by title, excerpt, or content
   * @param query - Search query
   * @param limit - Number of results (default: 20)
   * @returns Promise with search results
   */
  async searchPosts(
    query: string,
    limit: number = 20
  ): Promise<SSRBlogPostResponse> {
    try {
      const url = ssrHttpHelpers.createUrl("/user/blog/posts/search", {
        q: query,
        limit,
      });
      return await ssrHttpHelpers.get<SSRBlogPostResponse>(url);
    } catch (error) {
      return ssrHttpHelpers.handleError(error, {
        success: false,
        message: "Failed to search blog posts",
        data: [],
      });
    }
  }

  // ==================== Blog Categories Endpoints ====================

  /**
   * Get all blog categories
   * @returns Promise with all blog categories
   */
  async getCategories(): Promise<SSRBlogCategoryResponse> {
    try {
      return await ssrHttpHelpers.get<SSRBlogCategoryResponse>(
        "/user/blog/categories"
      );
    } catch (error) {
      return ssrHttpHelpers.handleError(error, {
        success: false,
        message: "Failed to fetch blog categories",
        data: [],
      });
    }
  }

  /**
   * Get a single blog category by slug
   * @param slug - Category slug
   * @returns Promise with category details
   */
  async getCategoryBySlug(slug: string): Promise<SSRBlogCategoryDetailResponse> {
    try {
      return await ssrHttpHelpers.get<SSRBlogCategoryDetailResponse>(
        `/user/blog/categories/${slug}`
      );
    } catch (error) {
      return ssrHttpHelpers.handleError(error, {
        success: false,
        message: "Failed to fetch blog category",
        data: null,
      });
    }
  }

  // ==================== Blog Tags Endpoints ====================

  /**
   * Get all blog tags
   * @returns Promise with all blog tags
   */
  async getTags(): Promise<SSRBlogTagResponse> {
    try {
      return await ssrHttpHelpers.get<SSRBlogTagResponse>("/user/blog/tags");
    } catch (error) {
      return ssrHttpHelpers.handleError(error, {
        success: false,
        message: "Failed to fetch blog tags",
        data: [],
      });
    }
  }

  /**
   * Get a single blog tag by slug
   * @param slug - Tag slug
   * @returns Promise with tag details
   */
  async getTagBySlug(slug: string): Promise<SSRBlogTagDetailResponse> {
    try {
      return await ssrHttpHelpers.get<SSRBlogTagDetailResponse>(
        `/user/blog/tags/${slug}`
      );
    } catch (error) {
      return ssrHttpHelpers.handleError(error, {
        success: false,
        message: "Failed to fetch blog tag",
        data: null,
      });
    }
  }

  // ==================== Helper Methods ====================

  /**
   * Build filter parameters for blog posts
   * @param filters - Filter options
   * @returns Record with query parameters
   */
  private buildFilterParams(
    filters: SSRBlogPostFilters
  ): Record<string, any> {
    const params: Record<string, any> = {};

    if (filters.page) params.page = filters.page;
    if (filters.limit) params.limit = filters.limit;
    if (filters.sortBy) params.sortBy = filters.sortBy;
    if (filters.sortOrder) params.sortOrder = filters.sortOrder;
    if (filters.search) params.search = filters.search;
    if (filters.categoryId) params.categoryId = filters.categoryId;
    if (filters.categorySlug) params.categorySlug = filters.categorySlug;
    if (filters.tagId) params.tagId = filters.tagId;
    if (filters.tagSlug) params.tagSlug = filters.tagSlug;
    if (filters.tagIds && Array.isArray(filters.tagIds) && filters.tagIds.length) {
      params.tagIds = filters.tagIds.join(",");
    }
    if (filters.publishedAfter) params.publishedAfter = filters.publishedAfter;
    if (filters.publishedBefore) params.publishedBefore = filters.publishedBefore;

    return params;
  }

  /**
   * Batch fetch multiple blog resources for a page
   * @param filters - Optional filters for posts
   * @returns Promise with multiple blog resources
   */
  async batchFetch(filters: SSRBlogPostFilters = {}) {
    try {
      const [posts, categories, tags] = await Promise.all([
        this.getPosts(filters),
        this.getCategories(),
        this.getTags(),
      ]);

      return {
        posts,
        categories,
        tags,
      };
    } catch (error) {
      console.error("SSR Blog Batch fetch error:", error);
      return {
        posts: {
          success: false,
          message: "Failed to fetch blog posts",
          data: [],
          meta: { page: 1, limit: 10, total: 0, pages: 0 },
        },
        categories: {
          success: false,
          message: "Failed to fetch categories",
          data: [],
        },
        tags: {
          success: false,
          message: "Failed to fetch tags",
          data: [],
        },
      };
    }
  }

  /**
   * Fetch all data needed for blog homepage
   * @param limit - Number of recent posts (default: 6)
   * @returns Promise with homepage data
   */
  async getHomepageData(limit: number = 6) {
    try {
      const [recentPosts, categories] = await Promise.all([
        this.getRecentPosts(limit),
        this.getCategories(),
      ]);

      return {
        recentPosts,
        categories,
      };
    } catch (error) {
      console.error("SSR Blog Homepage fetch error:", error);
      return {
        recentPosts: {
          success: false,
          message: "Failed to fetch recent posts",
          data: [],
        },
        categories: {
          success: false,
          message: "Failed to fetch categories",
          data: [],
        },
      };
    }
  }

  /**
   * Fetch all data needed for category page
   * @param categorySlug - Category slug
   * @param page - Page number (default: 1)
   * @param limit - Posts per page (default: 10)
   * @returns Promise with category page data
   */
  async getCategoryPageData(
    categorySlug: string,
    page: number = 1,
    limit: number = 10
  ) {
    try {
      const [category, posts] = await Promise.all([
        this.getCategoryBySlug(categorySlug),
        this.getPosts({ categorySlug, page, limit }),
      ]);

      return {
        category,
        posts,
      };
    } catch (error) {
      console.error("SSR Blog Category page fetch error:", error);
      return {
        category: {
          success: false,
          message: "Failed to fetch category",
          data: null,
        },
        posts: {
          success: false,
          message: "Failed to fetch posts",
          data: [],
          meta: { page, limit, total: 0, pages: 0 },
        },
      };
    }
  }

  /**
   * Fetch all data needed for tag page
   * @param tagSlug - Tag slug
   * @param page - Page number (default: 1)
   * @param limit - Posts per page (default: 10)
   * @returns Promise with tag page data
   */
  async getTagPageData(tagSlug: string, page: number = 1, limit: number = 10) {
    try {
      const [tag, posts] = await Promise.all([
        this.getTagBySlug(tagSlug),
        this.getPosts({ tagSlug, page, limit }),
      ]);

      return {
        tag,
        posts,
      };
    } catch (error) {
      console.error("SSR Blog Tag page fetch error:", error);
      return {
        tag: {
          success: false,
          message: "Failed to fetch tag",
          data: null,
        },
        posts: {
          success: false,
          message: "Failed to fetch posts",
          data: [],
          meta: { page, limit, total: 0, pages: 0 },
        },
      };
    }
  }

  /**
   * Fetch all data needed for single blog post page
   * @param slug - Blog post slug
   * @param relatedLimit - Number of related posts (default: 3)
   * @returns Promise with blog post page data
   */
  async getPostPageData(slug: string, relatedLimit: number = 3) {
    try {
      const post = await this.getPostBySlug(slug);

      // Only fetch related posts if we have a valid post
      if (post.success && post.data) {
        const relatedPosts = await this.getRelatedPosts(
          post.data.id,
          relatedLimit
        );

        return {
          post,
          relatedPosts,
        };
      }

      return {
        post,
        relatedPosts: {
          success: false,
          message: "No related posts",
          data: [],
        },
      };
    } catch (error) {
      console.error("SSR Blog Post page fetch error:", error);
      return {
        post: {
          success: false,
          message: "Failed to fetch blog post",
          data: null,
        },
        relatedPosts: {
          success: false,
          message: "Failed to fetch related posts",
          data: [],
        },
      };
    }
  }
}

export const ssrBlogService = new SSRBlogService();

