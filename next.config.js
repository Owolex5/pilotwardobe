/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      // If you want to keep a clean URL for the static page
      {
        source: '/legacy-home',
        destination: '/landing.html', // or whatever you rename it to
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