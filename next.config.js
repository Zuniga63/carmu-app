/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['ui-avatars.com', 'res.cloudinary.com'],
  },
};

module.exports = nextConfig;
