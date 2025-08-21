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
  output: 'standalone',
  images: {
    domains: [
      `${process.env.S3_BUCKET}.${process.env.S3_DOMAIN}`,
      `njord--prod.${process.env.S3_DOMAIN}`,
    ],
  },
  async headers() {
    return [
      {
        // Appliquer à toutes les routes API
        source: '/api/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: process.env.ALLOWED_ORIGINS || '*', // Configurez vos domaines autorisés
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization, provider_id, authorization-origin',
          },
          {
            key: 'Access-Control-Allow-Credentials',
            value: 'true',
          },
        ],
      },
    ]
  },
}

const config = withPlugins([withPWA], nextConfig)

module.exports = config
