/** @type {import('next').NextConfig} */
const runtimeCaching = require('next-pwa/cache')

const withPWA = require('next-pwa')({
  dest: 'public',
  // disable: process.env.NODE_ENV === 'development',
  // register: true,
  sw: 'sw.js'
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
