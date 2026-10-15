const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "noindex, nofollow",
          },
        ],
      },
    ];
  },

  output: "standalone",
  reactStrictMode: true,

  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "savehyar.storage.iran.liara.space",
      },
      {
        protocol: "https",
        hostname: "storage.c2.liara.space",
      },
      {
        protocol: "https",
        hostname: "computersales.storage.c2.liara.space",
      },
    ],
  },

  turbopack: {
    root: path.resolve(__dirname),
  },
};

module.exports = nextConfig;