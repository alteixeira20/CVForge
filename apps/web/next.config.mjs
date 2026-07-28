import { fileURLToPath } from 'node:url'

const repositoryRoot = fileURLToPath(new URL('../..', import.meta.url))

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
}

export default nextConfig
