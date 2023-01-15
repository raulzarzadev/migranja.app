/** @type {import('next').NextConfig} */
const runtimeCaching = require('next-pwa/cache')

const withPWA = require('next-pwa')({
  dest: 'public'
  // put other next-pwa options here
})

const nextConfig = withPWA({
  // pwa: {
  //   dest: 'public',
  //   scope: '/',
  //   disable: process.env.NODE_ENV === 'development'
  //   runtimeCaching,
  // },
  reactStrictMode: true,
  images: {
    domains: ['lh3.googleusercontent.com']
  }

  // put other next js options here
})

module.exports = nextConfig
