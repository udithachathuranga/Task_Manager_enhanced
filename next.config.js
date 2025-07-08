// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    config.watchOptions = {
      ignored: [
        '**/node_modules',
        '**/.git',
        'C:/Users/User/Application Data/**',
      ],
    };
    return config;
  },
};

module.exports = nextConfig;
