/** @type {import('next').NextConfig} */
const nextConfig = {
  publicRuntimeConfig: {
    APP_VERSION: process.env.npm_package_version,
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "http",
        hostname: "localhost/wp/",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      {
        protocol: "https",
        hostname: "secure.gravatar.com",
      },
      {
        protocol: 'https',
        hostname: 'server.combostore.bd',
      },
      {
        protocol: 'https',
        hostname: 'combostore.bd',
      },
    ],
  },
};

export default nextConfig;
