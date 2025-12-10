/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: [
      "images.pexels.com",
      "real-estate-web-storage.s3.amazonaws.com",
      "localhost",
    ],
  },
};

export default nextConfig;
