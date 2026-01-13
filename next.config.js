/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable remote image optimization for Unsplash (kept from before)
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
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

      // Aircraft Parts variations
      {
        source: '/shop/aircraftparts',
        destination: '/shop/aircraft-parts',
        permanent: true,
      },
      {
        source: '/shop/airplane-parts',
        destination: '/shop/aircraft-parts',
        permanent: true,
      },
      {
        source: '/shop/aircraftpart',
        destination: '/shop/aircraft-parts',
        permanent: true,
      },
      {
        source: '/shop/parts',
        destination: '/shop/aircraft-parts',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;