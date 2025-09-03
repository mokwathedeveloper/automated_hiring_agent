/** @type {import('next').NextConfig} */
const nextConfig = {
  // App directory is now stable in Next.js 14
  webpack: (config, { isServer }) => {
    // Fix for pdf-parse build issue
    if (isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
      // Ignore pdf-parse test files
      config.externals = config.externals || [];
      config.externals.push({
        'canvas': 'canvas',
        'jsdom': 'jsdom'
      });
    }
    return config;
  },
  experimental: {
    serverComponentsExternalPackages: ['pdf-parse']
  }
}

module.exports = nextConfig