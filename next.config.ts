import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/team",
        destination: "/teams",
        permanent: true,
      },
      {
        source: "/event",
        destination: "/events",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
