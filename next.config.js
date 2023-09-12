/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: true,
  images: {
    domains: ['ui-avatars.com', 'res.cloudinary.com'],
  },
};

module.exports = nextConfig;
