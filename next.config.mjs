/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        formats: ['image/avif', 'image/webp'],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
            },
        ],
    },
    async redirects() {
        return [
            {
                source: '/:lang/external/smartcatering',
                destination: '/:lang',
                permanent: true, // 308 Permanent Redirect (preserves query params for Meta Pixel/CAPI)
            },
            {
                source: '/external/smartcatering',
                destination: '/pl',
                permanent: true, // 308 Permanent Redirect
            },
        ];
    },
};

export default nextConfig;
