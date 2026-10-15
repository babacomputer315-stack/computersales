import SiteLayout from "@/components/site/layout/Layout";
import { ssrBlogService } from "@/services/ssr/blog.service";
import BlogPost from "@/types/blog";
import { GetServerSideProps } from "next";
import React, { ReactElement } from "react";
import Image from "next/image";
import Link from "next/link";
import { imageBaseUrl, siteUrl } from "@/utils/constants";
import { convertToJalali } from "@/utils/convertToJalali";
import Breadcrumb from "@/components/site/shared/Breadcrumb";
import { useIsMobile } from "@/hooks/useIsMobile";
import Head from "next/head";

interface BlogPostPageProps {
  post: BlogPost | null;
  relatedPosts: BlogPost[];
}

export function getReadingTime(text: string) {
  const wordsPerMinute = 200;
  const words = text.trim().split(/\s+/).length;
  const time = Math.ceil(words / wordsPerMinute);
  return `${time} دقیقه`;
}

const BlogPostPage = ({ post, relatedPosts }: BlogPostPageProps) => {
  const isMobile = useIsMobile();
  const readingTime = getReadingTime(post?.content || "");
  if (!post) {
    return (
      <div className="container mx-auto px-6 py-16">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">مطلب یافت نشد</h1>
          <Link
            href="/blog"
            className="text-primary-600 hover:text-primary-700"
          >
            بازگشت به وبلاگ
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{`${post.title} - حراج کامپیوتر`}</title>
        <meta
          key="description"
          name="description"
          content={post.seoDescription || post.excerpt || post.title}
        />
        <link
          key="canonical"
          rel="canonical"
          href={`${siteUrl}/blog/${post.slug}`}
        />

        {/* Open Graph Meta Tags */}
        <meta key="og:type" property="og:type" content="article" />
        <meta
          key="og:title"
          property="og:title"
          content={`${post.title} - حراج کامپیوتر`}
        />
        <meta
          key="og:description"
          property="og:description"
          content={post.seoDescription || post.excerpt || post.title}
        />
        <meta property="og:url" content={`${siteUrl}/blog/${post.slug}`} />
        {post.thumbnail?.name && (
          <meta
            key="og:image"
            property="og:image"
            content={`${imageBaseUrl}/${post.thumbnail.name}`}
          />
        )}
        <meta
          property="article:published_time"
          content={post.publishedAt}
        />
        <meta property="article:author" content={post.author?.name || "حراج کامپیوتر"} />
        {post.category?.name && (
          <meta property="article:section" content={post.category.name} />
        )}
        {post.tags?.map((tagItem) => (
          <meta
            key={`tag-${tagItem.id}`}
            property="article:tag"
            content={tagItem.tag.name}
          />
        ))}

        {/* Twitter Card Meta Tags */}
        <meta
          key="twitter:card"
          name="twitter:card"
          content="summary_large_image"
        />
        <meta
          key="twitter:title"
          name="twitter:title"
          content={`${post.title} - حراج کامپیوتر`}
        />
        <meta
          key="twitter:description"
          name="twitter:description"
          content={post.seoDescription || post.excerpt || post.title}
        />
        {post.thumbnail?.name && (
          <meta
            key="twitter:image"
            name="twitter:image"
            content={`${imageBaseUrl}/${post.thumbnail.name}`}
          />
        )}
        <meta
          key="twitter:image:alt"
          name="twitter:image:alt"
          content={post.title}
        />

        {/* Structured Data - Article */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Article",
              headline: post.title,
              description: post.seoDescription || post.excerpt || post.title,
              image: post.thumbnail?.name
                ? `${imageBaseUrl}/${post.thumbnail.name}`
                : undefined,
              datePublished: post.publishedAt,
              dateModified: post.updatedAt,
              author: {
                "@type": "Person",
                name: post.author?.name || "حراج کامپیوتر",
              },
              publisher: {
                "@type": "Organization",
                name: "حراج کامپیوتر",
                logo: {
                  "@type": "ImageObject",
                  url: `${siteUrl}/assets/images/logo-full.svg`,
                },
              },
              mainEntityOfPage: {
                "@type": "WebPage",
                "@id": `${siteUrl}/blog/${post.slug}`,
              },
            }),
          }}
        />
      </Head>
      <div className="container mx-auto px-6 lg:px-0">
        {/* Breadcrumb */}
        <div className="hidden lg:block">
          <Breadcrumb
            items={[
              { title: "صفحه اصلی", href: "/" },
              { title: "وبلاگ", href: "/blog" },
              {
                title: post?.category?.name,
                href: `/blog?categorySlug=${post?.category?.slug}`,
              },
              { title: post.title, href: "" },
            ]}
          />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8 mb-32">
          {/* Main Content */}
          <article className="lg:col-span-2">
            <div>
              {/* Header */}
              {/* <header className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-sm bg-primary-100 text-primary-700 px-3 py-1 rounded-full">
                  {post.category.name}
                </span>
                <span className="text-sm text-gray-500">
                  {convertToJalali(post.publishedAt)}
                </span>
              </div>
              <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
              {post.author && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>نویسنده:</span>
                  <span className="font-medium">{post.author.name}</span>
                </div>
              )}
            </header> */}

              {/* Featured Image */}
              {post.thumbnail && (
                <div className="relative mb-24">
                  <div className="relative aspect-square lg:aspect-[4/2] mb-6 rounded-2xl overflow-hidden">
                    <Image
                      src={`${imageBaseUrl}/${post.thumbnail.name}`}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="bg-[#F4F6FA] absolute -bottom-10 lg:-bottom-16 z-10 right-4 left-4 lg:right-10 lg:left-10 p-4 lg:p-8 gap-3 lg:gap-4 rounded-2xl lg:rounded-3xl flex flex-col">
                    <h1 className="text-sm font-bold lg:text-2xl">
                      {post.title}
                    </h1>
                    <div className="flex items-center gap-10">
                      <div className="flex items-center gap-1 lg:gap-2 text-sm">
                        <Image
                          src={"/assets/icons/post-calendar.svg"}
                          alt="post-calendar"
                          width={isMobile ? 20 : 24}
                          height={isMobile ? 20 : 24}
                        />
                        <span>{convertToJalali(post.publishedAt)}</span>
                      </div>
                      <div className="flex items-center gap-1 lg:gap-2 text-sm">
                        <Image
                          src={"/assets/icons/post-clock.svg"}
                          alt="post-calendar"
                          width={isMobile ? 20 : 24}
                          height={isMobile ? 20 : 24}
                        />
                        <span>{readingTime}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Excerpt */}
              {post.excerpt && (
                <div className="bg-[#FDE9EB] rounded-2xl p-4 lg:p-6 flex flex-col gap-5 mb-6">
                  <div className="flex items-center gap-2 lg:gap-4">
                    <Image
                      src={"/assets/icons/excerpt.svg"}
                      alt="post-excerpt"
                      width={24}
                      height={24}
                      className="object-contain"
                    />
                    <h2 className="text-sm font-bold lg:text-base">
                      خلاصه مطلب
                    </h2>
                  </div>
                  <div>{post.excerpt}</div>
                </div>
                //   <div className="bg-gray-50 border-r-4 border-primary-500 p-4 mb-6 rounded">
                //     <p className="text-gray-700 leading-relaxed">{post.excerpt}</p>
                //   </div>
              )}

              {/* Content */}
              <div
                className="mb-8"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="border-t border-stroke pt-6">
                  <h3 className="text-sm font-bold mb-4">برچسب‌ها:</h3>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tagItem) => (
                      <Link
                        key={tagItem.id}
                        href={`/blog?tagSlug=${tagItem.tag.slug}`}
                        className="text-sm px-3 py-1 rounded-full transition-colors bg-[#F4F6FA]"
                      >
                        #{tagItem.tag.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Comments Section (if needed) */}
            {/* You can add comments component here */}
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            {/* Related Posts */}
            {relatedPosts && relatedPosts.length > 0 && (
              <div className="bg-white rounded-2xl border border-stroke p-4 lg:p-6 mb-6 lg:sticky top-24">
                <div className="flex items-center gap-2 mb-6">
                  <Image
                    src={"/assets/icons/related-posts.svg"}
                    alt="related-posts"
                    width={24}
                    height={24}
                  />
                  <h2 className="text-base lg:text-lg font-bold">
                    مطالب <span className="text-primary">مرتبط</span>
                  </h2>
                </div>
                <div className="space-y-4">
                  {relatedPosts.map((relatedPost) => (
                    <Link
                      key={relatedPost.id}
                      href={`/blog/${relatedPost.slug}`}
                      className="block group"
                    >
                      <div>
                        <div className="flex items-center gap-2 text-xs text-secondary-text">
                          <Image
                            src={`/assets/icons/blue-recangle.svg`}
                            alt="blue-recangle"
                            width={12}
                            height={12}
                          />
                          <span>{convertToJalali(relatedPost.createdAt)}</span>
                        </div>
                        <div className="py-3.5 border-r mr-1.5 mt-1 pr-3 border-stroke text-sm lg:text-base font-semibold">
                          {post.title}
                        </div>
                      </div>
                      {/* <div className="flex gap-3">
                      {relatedPost.thumbnail && (
                        <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={`${imageBaseUrl}/${relatedPost.thumbnail.name}`}
                            alt={relatedPost.thumbnail.alt || relatedPost.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="text-sm font-medium line-clamp-2 group-hover:text-primary-600 transition-colors mb-1">
                          {relatedPost.title}
                        </h3>
                        <span className="text-xs text-gray-500">
                          {convertToJalali(relatedPost.publishedAt)}
                        </span>
                      </div>
                    </div> */}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Category Info */}
            {/* <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-bold mb-4">دسته‌بندی</h2>
            <Link
              href={`/blog?categorySlug=${post?.category?.slug}`}
              className="block text-primary-600 hover:text-primary-700 font-medium"
            >
              {post?.category?.name}
            </Link>
            {post?.category?.description && (
              <p className="text-sm text-gray-600 mt-2">
                {post?.category?.description}
              </p>
            )}
          </div> */}
          </aside>
        </div>
      </div>
    </>
  );
};

export default BlogPostPage;

BlogPostPage.getLayout = function getLayout(page: ReactElement) {
  return <SiteLayout>{page}</SiteLayout>;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const { slug } = context.params as { slug: string };

    // Fetch post and related posts
    const { post, relatedPosts } = await ssrBlogService.getPostPageData(
      slug,
      3 // Number of related posts
    );

    // If post not found, return 404
    if (!post.success || !post.data) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        post: post.data,
        relatedPosts: relatedPosts.data || [],
      },
    };
  } catch (error) {
    console.error("Error fetching blog post:", error);
    return {
      notFound: true,
    };
  }
};
