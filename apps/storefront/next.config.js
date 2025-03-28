/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/products',
        destination: '/products/1',
        permanent: true,
      },
    ]
  },
  images: {
    domains: [
      'localhost',
      'minio',
      process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ? new URL(process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL).hostname : 'localhost',
      process.env.NEXT_PUBLIC_CMS_URL ? new URL(process.env.NEXT_PUBLIC_CMS_URL).hostname : 'localhost',
    ],
  },
}

module.exports = nextConfig 