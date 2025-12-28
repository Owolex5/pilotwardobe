/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/home',
        destination: '/home.html',
      },
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