/** @type {import('next').NextConfig} */
const nextConfig = {
  // Standalone output keeps the runtime image small (no node_modules copy).
  output: "standalone",
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    remotePatterns: [{ protocol: "https", hostname: "cdn.orbitly.example" }],
  },
};

export default nextConfig;
