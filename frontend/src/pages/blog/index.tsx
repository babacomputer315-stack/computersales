import SiteLayout from "@/components/site/layout/Layout";
import { ssrBlogService } from "@/services/ssr/blog.service";
import BlogPost from "@/types/blog";
import BlogCategory from "@/types/blogCategory";
import { GetServerSideProps } from "next";
import React, { ReactElement, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { imageBaseUrl, siteUrl } from "@/utils/constants";
import { convertToJalali } from "@/utils/convertToJalali";
import Pagination from "@/components/site/shared/Pagination";
import { useRouter } from "next/router";
import Head from "next/head";

interface BlogPageProps {
  posts: BlogPost[];
  categories: BlogCategory[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

const BlogPage = ({ posts, categories, pagination }: BlogPageProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const router = useRouter();

  return (
    <>
      <Head>
        <title>وبلاگ - حراج کامپیوتر</title>
        <meta
          key="description"
          name="description"
          content="آخرین مقالات و اخبار دنیای کامپیوتر و سخت‌افزار"
        />
        <link
          key="canonical"
          rel="canonical"
          href={`${siteUrl}/blog`}
        />

        {/* Open Graph Meta Tags */}
        <meta key="og:type" property="og:type" content="website" />
        <meta
          key="og:title"
          property="og:title"
          content="وبلاگ - حراج کامپیوتر"
        />
        <meta
          key="og:description"
          property="og:description"
          content="آخرین مقالات و اخبار دنیای کامپیوتر و سخت‌افزار"
        />
        <meta property="og:url" content={`${siteUrl}/blog`} />

        {/* Twitter Card Meta Tags */}
        <meta
          key="twitter:card"
          name="twitter:card"
          content="summary_large_image"
        />
        <meta
          key="twitter:title"
          name="twitter:title"
          content="وبلاگ - حراج کامپیوتر"
        />
        <meta
          key="twitter:description"
          name="twitter:description"
          content="آخرین مقالات و اخبار دنیای کامپیوتر و سخت‌افزار"
        />
      </Head>
      <div className="container mx-auto px-6 lg:px-0 py-6">
      {/* Header */}
      <div className="mb-6 bg-[#F4F6FA] p-8 rounded-2xl">
        <h1 className="text-sm text-center lg:text-right lg:text-xl font-bold">
          در وبلاگ <span className="text-primary">حراج کامپیوتر</span>، هر روز
          یک نکته برای انتخاب بهتر
        </h1>
      </div>

      <ul className="flex overflow-x-auto items-center hidden-scrollbar mb-6 gap-3">
        <li onClick={() => setSelectedCategory(null)}>
          <Link
            href="/blog"
            className={`block py-2 px-4 rounded-full text-xs lg:text-sm transition-colors whitespace-nowrap min-w-fit ${
              !selectedCategory
                ? "border border-primary font-medium"
                : "border border-stroke"
            }`}
          >
            همه مطالب
          </Link>
        </li>
        {categories.map((category) => (
          <li
            onClick={() => setSelectedCategory(category.slug)}
            key={category.id}
            className="min-w-fit whitespace-nowrap"
          >
            <Link
              href={`/blog?categorySlug=${category.slug}`}
              className={`block py-2 px-4 rounded-full text-xs lg:text-sm transition-colors
              ${
                selectedCategory === category.slug
                  ? "border border-primary font-medium"
                  : "border border-stroke"
              }
              `}
            >
              {category.name}
            </Link>
          </li>
        ))}
      </ul>

      {/* Main Content */}
      <main className="mb-32">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {posts.map((post) => (
            <article
              key={post.id}
              className="bg-white rounded-xl hover:border-primary border border-stroke transition-all duration-300 overflow-hidden p-4"
            >
              <Link href={`/blog/${post.slug}`}>
                {post.thumbnail && (
                  <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden">
                    <Image
                      src={`${imageBaseUrl}/${post?.thumbnail?.name}`}
                      alt={post?.thumbnail?.alt || post?.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div>
                  <div className="my-4 flex flex-col gap-2">
                    <h2 className="text-sm lg:text-base font-semibold line-clamp-1">
                      {post?.title}
                    </h2>
                    <span className="line-clamp-1 text-xs lg:text-sm text-secondary-text">
                      {post.excerpt}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {post.category ? (
                        <div className="bg-[#E6ECF3] text-[#023F88] text-xs lg:text-sm font-semibold px-3 py-2 rounded-lg">
                          {post?.category?.name}
                        </div>
                      ) : null}
                      <span className="text-secondary-text text-sm">
                        {convertToJalali(post.createdAt)}
                      </span>
                    </div>
                    <Image
                      src={"/assets/icons/post-arrow.svg"}
                      alt="post-arrow"
                      width={40}
                      height={40}
                    />
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.pages}
          onPageChange={(page) => {
            router.push(
              `/blog?page=${page}${
                selectedCategory ? `&categorySlug=${selectedCategory}` : ""
              }`
            );
          }}
        />
      </main>
      </div>
    </>
  );
};

export default BlogPage;

BlogPage.getLayout = function getLayout(page: ReactElement) {
  return <SiteLayout>{page}</SiteLayout>;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const { page, categorySlug, search } = context.query;

    const filters = {
      page: page ? parseInt(page as string) : 1,
      limit: 12,
      categorySlug: categorySlug as string | undefined,
      search: search as string | undefined,
      sortBy: "publishedAt" as const,
      sortOrder: "desc" as const,
    };

    const { posts, categories } = await ssrBlogService.batchFetch(filters);

    return {
      props: {
        posts: posts.data || [],
        categories: categories.data || [],
        pagination: posts.meta || {
          page: 1,
          limit: 12,
          total: 0,
          pages: 0,
        },
      },
    };
  } catch (error) {
    console.error("Error fetching blog data:", error);
    return {
      props: {
        posts: [],
        categories: [],
        pagination: {
          page: 1,
          limit: 12,
          total: 0,
          pages: 0,
        },
      },
    };
  }
};
