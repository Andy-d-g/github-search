import type { Config } from "@react-router/dev/config";

export default {
  ssr: false,
  buildDirectory: 'dist',
  basename: process.env.NODE_ENV === "production" ? "/github-search/" : "/",
} satisfies Config;
