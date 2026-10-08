import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/api/lead": ["./public/marca/wordcom-logo.png"],
  },
};

export default nextConfig;
