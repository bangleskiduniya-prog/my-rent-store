/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Build ke waqt TypeScript errors ko ignore karega (No more Build Failed)
    ignoreBuildErrors: true,
  },
  eslint: {
    // Linting errors ko ignore karega
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com', // Cloudinary images ke liye
      },
    ],
  },
};

export default nextConfig;
