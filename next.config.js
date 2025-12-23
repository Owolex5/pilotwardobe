/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,  // ← This stops next/image from failing on Vercel
  },
};

module.exports = nextConfig;