import withPWA from 'next-pwa';
import fs from 'fs';
import path from 'path';

/** @type {import('next').NextConfig} */
const nextConfig = {
    basePath: process.env.NODE_ENV === "development" ? "/":"/aouplr",
    reactStrictMode: true,
    swcMinify: true,
    compiler: {
        removeConsole: process.env.NODE_ENV !== "development"
    },
    webpack: (config, { isServer }) => {
        if (!isServer) {
            // Ensure the data folder is included in the build
            const dataPath = path.resolve(process.cwd(), 'public/data');
            if (fs.existsSync(dataPath)) {
                config.module.rules.push({
                    test: /\.(json)$/,
                    include: [dataPath],
                    type: 'asset/resource',
                });
            }
        }
        return config;
    }
};

export default withPWA({
    dest: "public",
    disable: process.env.NODE_ENV === "development",
    register: true,
    skipWaiting: true,
})(nextConfig);