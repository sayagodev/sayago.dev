import { withIntlayer } from 'next-intlayer/server'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
}

export default withIntlayer(nextConfig)
