import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  serverExternalPackages: ["@prisma/client"],
  // Há um package-lock.json na pasta do usuário; fixa a raiz neste projeto.
  outputFileTracingRoot: process.cwd(),
};

export default nextConfig;
