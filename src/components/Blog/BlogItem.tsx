// src/components/Blog/BlogItem.tsx (or your exact path: src/components/BlogItem.tsx)

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { BlogItem as BlogItemType } from "@/types/blogItem"; // Adjust path if needed

interface BlogItemProps {
  blog: BlogItemType;
}

const BlogItem: React.FC<BlogItemProps> = ({ blog }) => {
  return (
    <Link
      href={`/blog/${blog.slug}`}
      className="block group"
      aria-label={`Read more about ${blog.title}`}
    >
      <article className="rounded-3xl overflow-hidden shadow-xl bg-white group-hover:shadow-2xl group-hover:-translate-y-2 transition-all duration-500">
        <div className="relative h-64 overflow-hidden">
          <Image
            src={blog.img}
            alt={blog.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>

        <div className="p-7">
          <p className="text-sm text-dark-4 mb-4 flex items-center gap-2">
            <time dateTime={blog.date}>{blog.date}</time>
            <span>•</span>
            <span>{blog.views.toLocaleString()} views</span>
          </p>

          <h3 className="text-xl lg:text-2xl font-bold text-dark line-clamp-2 group-hover:text-blue transition-colors duration-300">
            {blog.title}
          </h3>

          <div className="mt-5 flex items-center gap-3 text-blue font-semibold">
            <span>Read More</span>
            <svg
              className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>
      </article>
    </Link>
  );
};

export default BlogItem;