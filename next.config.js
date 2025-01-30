/** @type {import('next').NextConfig} */
const serviceAccount = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
const nextConfig = {
  
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
