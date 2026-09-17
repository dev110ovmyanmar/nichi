import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "127.0.0.1",
    "localhost",
    "*.localhost",
    "0.0.0.0",
    "cursor.com",
    "*.cursor.com",
    "**.cursor.com",
    "cursor.sh",
    "*.cursor.sh",
    "**.cursor.sh",
  ],
};

export default nextConfig;
