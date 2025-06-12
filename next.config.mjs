/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export", // obrigatório
  trailingSlash: true, // evita problemas de roteamento
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
