import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable server actions for file uploads
  experimental: {
    serverActions: {
      bodySizeLimit: "50mb",
    },
  },

  // Empty turbopack config to silence the warning
  turbopack: {},

  // Headers for PDF files
  async headers() {
    return [
      {
        source: "/api/pdf",
        headers: [
          {
            key: "Content-Type",
            value: "application/pdf",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
