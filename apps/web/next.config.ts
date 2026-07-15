import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@bizbridge/shared', '@bizbridge/ui'],
  // Emits .next/standalone with a self-contained server bundle — required for
  // the Dockerfile at the repo root.
  output: 'standalone',
  experimental: {
    reactCompiler: false,
  },
  webpack(config) {
    // Resolve workspace packages that import their own modules with `.js`
    // extensions (required by NodeNext) back to the `.ts` source files.
    config.resolve.extensionAlias = {
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }
    return config
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.r2.dev',
      },
      {
        protocol: 'https',
        hostname: '**.r2.cloudflarestorage.com',
      },
    ],
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
