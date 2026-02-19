import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  async rewrites() {
    if (!isProd) return [];

    return [
      {
        source: "/api/:path*",
        destination:
          "https://primetrade-assignment-task.onrender.com/api/v1/:path*",
      },
    ];
  },
};

export default nextConfig;
