/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/',           // root URL
        destination: '/landing.html',  // serve this file, URL stays '/'
      },
      {
        source: '/terms',
        destination: '/terms.html',
      },
      {
        source: '/privacy',
        destination: '/privacy.html',
      },
      {
        source: '/customer-business-agreement',
        destination: '/customer-business-agreement.html',
      },
    ];
  },
};

module.exports = nextConfig;
