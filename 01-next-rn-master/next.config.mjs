/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    transpilePackages: [
        'antd',
        '@ant-design/pro-components',
        '@ant-design/pro-layout',
        'rc-util',
        'rc-pagination',
        'rc-picker'
    ],
};

export default nextConfig;
