/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "softlineinfo.com.br", port: "", pathname: "/wp-content/uploads/2019/04/logo-progjteo.png" },
      { protocol: "https", hostname: "www.atlanticosulcomercio.com.br", port: "", pathname: "/image/catalog/logo-atlantico-sul.png" },
      { protocol: "https", hostname: "ecommerce-atlantico.s3.us-east-005.backblazeb2.com" },
    ],
  },
};

module.exports = nextConfig;
