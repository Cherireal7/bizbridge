import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@bizbridge/shared', '@bizbridge/ui'],
  // Keep server-only auth modules out of the client + server bundlers so
  // Next doesn't try to resolve their optional peer adapters (kysely, etc.).
  serverExternalPackages: ['better-auth', '@better-auth/core', '@better-auth/kysely-adapter'],
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
