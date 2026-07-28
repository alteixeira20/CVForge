import { fileURLToPath } from 'node:url'

const repositoryRoot = fileURLToPath(new URL('../..', import.meta.url))
const isDevelopment = process.env.NODE_ENV !== 'production'
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval'${isDevelopment ? " 'unsafe-eval'" : ''} blob:`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "connect-src 'self' data: blob:",
  "worker-src 'self' blob:",
  "frame-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join('; ')

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  outputFileTracingRoot: repositoryRoot,
  outputFileTracingIncludes: {
    '/*': [
      '../../node_modules/.pnpm/@img+sharp-linux-x64@*/node_modules/@img/sharp-libvips-linux-x64/**/*',
      '../../node_modules/.pnpm/@img+sharp-linuxmusl-x64@*/node_modules/@img/sharp-libvips-linuxmusl-x64/**/*',
      '../../node_modules/.pnpm/sharp@*/node_modules/@img/sharp-libvips-linux-x64/**/*',
      '../../node_modules/.pnpm/sharp@*/node_modules/@img/sharp-libvips-linuxmusl-x64/**/*',
    ],
  },
  productionBrowserSourceMaps: false,
  async headers() {
    return [{
      source: '/(.*)',
      headers: [
        { key: 'Content-Security-Policy', value: contentSecurityPolicy },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=()' },
        { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
        { key: 'Cross-Origin-Resource-Policy', value: 'same-origin' },
      ],
    }]
  },
}

export default nextConfig
