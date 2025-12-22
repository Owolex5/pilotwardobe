// src/app/(site)/(pages)/blog/[slug]/page.tsx

import blogData from "@/data/blogData";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumb from "@/components/Common/Breadcrumb";
import { Metadata } from "next";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = blogData.find((p) => p.slug === slug);

  if (!post) {
    return { title: "Post Not Found" };
  }

  return {
    title: `${post.title} | PilotWardrobe Blog`,
    description: `Expert 2025 aviation gear guide: ${post.title.toLowerCase()}. Reviews, tips, and recommendations from experienced pilots.`,
    openGraph: {
      title: post.title,
      description: `Read: ${post.title}`,
      images: [post.img],
      type: "article",
    },
  };
}

export async function generateStaticParams() {
  return blogData.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params;
  const post = blogData.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <>
      <Breadcrumb title={post.title} pages={["Home", "Blog", post.title]} />

      <section className="py-20 lg:py-28 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-8">
          {/* Featured Image */}
          <div className="relative h-96 lg:h-[520px] rounded-3xl overflow-hidden shadow-2xl mb-12">
            <Image
              src={post.img}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Post Header */}
          <header className="text-center mb-12">
            <h1 className="text-4xl lg:text-6xl font-bold text-dark mb-6">
              {post.title}
            </h1>
            <div className="flex items-center justify-center gap-6 text-dark-4 text-lg">
              <span className="font-medium">Captain Ayeni James</span>
              <span>•</span>
              <span>{post.date}</span>
              <span>•</span>
              <span>{post.views.toLocaleString()} views</span>
            </div>
          </header>

          {/* Main Article Content - Real HTML from blogData */}
          <article
  className="prose prose-xl max-w-none mx-auto text-dark-4 leading-relaxed space-y-8 mb-16"
  dangerouslySetInnerHTML={{
    __html: post.content || "<p>No content available.</p>",
  }}
/>

          {/* Call to Action */}
          <div className="bg-gradient-to-r from-blue-50 to-green-50 border-2 border-blue rounded-3xl p-10 text-center my-20">
            <h3 className="text-3xl font-bold text-dark mb-6">
              Ready to Upgrade Your Cockpit?
            </h3>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                href="/shop-without-sidebar"
                className="px-10 py-5 bg-blue text-white font-bold text-xl rounded-2xl hover:bg-blue-dark transition shadow-xl"
              >
                Browse Shop →
              </Link>
              <Link
                href="/sell"
                className="px-10 py-5 border-2 border-blue text-blue font-bold text-xl rounded-2xl hover:bg-blue hover:text-white transition"
              >
                Sell or Swap Yours
              </Link>
            </div>
          </div>

          {/* Author Bio */}
          <div className="mt-20 pt-12 border-t-2 border-gray-200">
            <div className="flex items-center gap-8">
              <div className="w-28 h-28 rounded-full bg-gray-200 border-4 border-white shadow-lg" />
              <div>
                <h4 className="text-2xl font-bold text-dark mb-2">
                  Captain Ayeni James
                </h4>
                <p className="text-dark-4">
                  Founder of PilotWardrobe. 15+ years of flying experience across regional and international routes. 
                  Passionate about helping pilots access premium aviation gear at fair prices.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}