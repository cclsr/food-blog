import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // 默认只有 1MB，照片上传会超；放宽到 8MB（表单里仍限制单图 5MB）
      bodySizeLimit: "8mb",
    },
  },
};

export default nextConfig;
