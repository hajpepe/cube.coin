/** @type {import('next').NextConfig} */
const nextConfig = {

          images: {
            remotePatterns: [
              {
                protocol: 'https',
                hostname: 'i.ibb.co',
                port: '',
                pathname: '/qRNLRRS/**',
              },
            ],
          },

};

export default nextConfig;
