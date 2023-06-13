/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
  dest: 'public',
  fallbacks: {},
  register: true,
  mode: 'production',
})

module.exports = withPWA({
  // next.js config
})
