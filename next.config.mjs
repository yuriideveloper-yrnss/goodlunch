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
                destination: 'https://good-lunch.pl/:lang',
                permanent: true, // 308 Permanent Redirect to official domain
            },
            {
                source: '/external/smartcatering',
                destination: 'https://good-lunch.pl/pl',
                permanent: true, // 308 Permanent Redirect to official domain
            },
        ];
    },
};

export default nextConfig;
