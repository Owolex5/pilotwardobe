/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      // Only keep non-homepage rewrites
      {
        source: '/terms',
        destination: '/terms.html',
      },
      {
        source: '/customer-business-agreement',
        destination: '/customer-business-agreement.html',
      },
      {
        source: '/privacy',
        destination: '/privacy.html',
      },
    ];
  },
};

module.exports = nextConfig;