import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Trailing slashes off: canonical URLs end in .html on the legacy paths and
  // have no extension on the new ones. vercel.json owns the normalisation.
  trailingSlash: false,
  poweredByHeader: false,
};

export default nextConfig;
