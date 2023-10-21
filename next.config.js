/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [{ protocol: "https", hostname: "softlineinfo.com.br", port: "", pathname: "/wp-content/uploads/2019/04/logo-progjteo.png" }],
  },
};

module.exports = nextConfig;
