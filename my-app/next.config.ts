import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "tushardudeja01-pcb-defect-detection.hf.space",
        pathname: "/**",
      },
    ],
  },
};


export default nextConfig;
