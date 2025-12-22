// app/blog/page.tsx
import React from "react";
import BlogGrid from "@/components/BlogGrid";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "PilotWardrobe Blog | Aviation Gear Guides & Reviews",
  description:
    "Expert reviews and buying guides for pilot headsets, watches, flight bags, uniforms, and more. Written by experienced pilots.",
  openGraph: {
    title: "PilotWardrobe Blog",
    description: "Expert aviation gear guides and reviews",
    images: ["/images/og-blog.jpg"],
  },
};

const BlogPage = () => {
  return <BlogGrid />;
};

export default BlogPage;