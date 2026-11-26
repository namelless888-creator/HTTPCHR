import type { NextConfig } from "next";
import { BASE_PATH } from "./lib/site";

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath: BASE_PATH,
  assetPrefix: BASE_PATH,
  images: {
    loader: 'custom',
    loaderFile: './lib/image-loader.ts',
  },
};

export default nextConfig;
