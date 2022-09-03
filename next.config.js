/** @type {import('next').NextConfig} */
const withPWA = require("next-pwa")({
  dest: "public",
  // put other next-pwa options here
});

const nextConfig = withPWA({
  reactStrictMode: true,
  // put other next js options here
});

module.exports = nextConfig;
