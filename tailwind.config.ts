import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ut: {
          navy: "#232C3E",
          blue: "#2632A0",
          indigo: "#02002F",
          slate: "#798DB8",
          charcoal: "#272727",
          cream: "#F4F0E8",
          mist: "#D8DCE5",
          glow: "#9DA8D8",
        },
      },
      boxShadow: {
        soft: "0 20px 60px rgba(2, 0, 47, 0.28)",
      },
      letterSpacing: {
        wide: "0.12em",
      },
    },
  },
  plugins: [],
};

export default config;
