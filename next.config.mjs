import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Pin the trace root to this project, so Next does not scan a parent folder with another lockfile.
  outputFileTracingRoot: projectRoot,
};

export default nextConfig;
