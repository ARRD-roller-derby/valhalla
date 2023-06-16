/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  sw: 'service-worker.js',
  mode: 'production',
  fallbacks: {},
})
const runtimeCaching = require('next-pwa/cache')
const withPlugins = require('next-compose-plugins')
runtimeCaching[0].handler = 'StaleWhileRevalidate'

const nextConfig = {
  reactStrictMode: true,
  swcMinify: false,
  images: {
    domains: [
      `${process.env.S3_BUCKET}.${process.env.S3_DOMAIN}`,
      `njord--prod.${process.env.S3_DOMAIN}`,
    ],
  },
}

const config = withPlugins([withPWA], nextConfig)

module.exports = config
