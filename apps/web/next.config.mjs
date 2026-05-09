/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  // Ensure we can use the app in a container
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
}

export default nextConfig
