/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: '**',
			},
		],
		dangerouslyAllowSVG: true,
	},
	// standalone
	output: 'standalone',
	productionBrowserSourceMaps: false,
	experimental: {
		optimizeServerReact: true,
	},
};

export default nextConfig;
