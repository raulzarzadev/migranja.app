/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
  dest: 'public'
  // put other next-pwa options here
})

const nextConfig = withPWA({
  reactStrictMode: true,
  images: {
    domains: ['lh3.googleusercontent.com']
  }
  // put other next js options here
})

module.exports = nextConfig
