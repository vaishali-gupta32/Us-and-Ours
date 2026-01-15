import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '4mb', // Increase limit for simple base64 uploads
    },
  },
  images: {
    domains: ['res.cloudinary.com'],
  },
};

export default nextConfig;
