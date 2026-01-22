/** @type {import('next').NextConfig} */
const nextConfig = {
  // Cloudflare Pages requires this for proper deployment
  output: 'standalone', // Creates optimized build files
  
  // Image optimization
  images: {
    // Enable remote image optimization for Unsplash
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
    // Cloudflare Pages doesn't support Next.js Image Optimization by default
    // Use Cloudflare Image Optimization or set unoptimized: true
    unoptimized: true, // Disable Next.js image optimization
  },

  // URL redirects (301 permanent - good for SEO)
  async redirects() {
    return [
      // === ONLY exact /shop (no trailing path) redirects to /marketplace ===
      {
        source: '/shop',                    // Matches EXACTLY /shop (and /shop/ but Next.js normalizes)
        destination: '/marketplace',
        permanent: true,
      },

      // === Your existing specific redirects (kept as-is) ===
      // Uniforms / Epaulettes / Wings variations
      {
        source: '/shop/epaulettes',
        destination: '/shop/uniforms',
        permanent: true,
      },
      {
        source: '/shop/epaulets',
        destination: '/shop/uniforms',
        permanent: true,
      },
      {
        source: '/shop/epaulette',
        destination: '/shop/uniforms',
        permanent: true,
      },
      {
        source: '/shop/epaulet',
        destination: '/shop/uniforms',
        permanent: true,
      },
      {
        source: '/shop/wings',
        destination: '/shop/uniforms',
        permanent: true,
      },

      // Sunglasses / Aviator variations
      {
        source: '/shop/sunglass',
        destination: '/shop/sunglasses',
        permanent: true,
      },
      {
        source: '/shop/aviator',
        destination: '/shop/sunglasses',
        permanent: true,
      },
      {
        source: '/shop/aviators',
        destination: '/shop/sunglasses',
        permanent: true,
      },
    ];
  },
  
  // Optional: Increase timeout for Cloudflare Pages
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
};

module.exports = nextConfig;