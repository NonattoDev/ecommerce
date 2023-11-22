/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [{ protocol: "https", hostname: "ecommerce-atlantico.s3.us-east-005.backblazeb2.com" }],
  },
};

module.exports = nextConfig;
