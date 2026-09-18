import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        sidebar: "#111827",
        accent: "#6366f1",
      },
    },
  },
  plugins: [],
};

export default config;
