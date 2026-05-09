import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      const originalEntry = config.entry;
      config.entry = async () => {
        const entries = await originalEntry();
        if (typeof entries === "object" && entries !== null) {
          for (const key of Object.keys(entries)) {
            const entry = entries[key];
            if (
              Array.isArray(entry) &&
              key.startsWith("static/chunks/") &&
              !entry.some((e: string) => e.includes("wdyr"))
            ) {
              entry.unshift("./lib/wdyr.ts");
            }
          }
        }
        return entries;
      };
    }
    return config;
  },
};

export default nextConfig;
