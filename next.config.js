/** @type {import('next').NextConfig} */
const nextConfig = {
  output:"standalone",
  staticPageGenerationTimeout:120,
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
        pathname: "/techsepet1/**",
      },
    ],
  },
};

module.exports = nextConfig;
