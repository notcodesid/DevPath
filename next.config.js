const { createCivicAuthPlugin } = require("@civic/auth/nextjs");

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'lh3.googleusercontent.com',  // Google profile images
      'googleusercontent.com',      // Alternative Google image domain
    ],
  },
  // Add other Next.js config options here as needed
};

const withCivicAuth = createCivicAuthPlugin({
  clientId: "85828878-b84c-43cb-94a6-fde2fe10bdde"
});

module.exports = withCivicAuth(nextConfig); 