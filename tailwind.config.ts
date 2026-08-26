import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./features/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        forge: {
          950: "#09090B",
          900: "#0F0F12",
          850: "#141418",
          800: "#1C1C22",
          750: "#24242C",
          700: "#2E2E38",
          600: "#4A4A57",
          500: "#71717A",
          400: "#A1A1AA",
          300: "#D4D4D8",
          200: "#E4E4E7",
          100: "#F4F4F5",
          50: "#FAFAFA",
        },
        brand: {
          red: "#E11D48",
          orange: "#FF4500",
          flame: "#F97316",
          darkRed: "#9F1239",
          crimson: "#BE123C",
          gold: "#F59E0B",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        heading: ["var(--font-outfit)", "sans-serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "forge-gradient": "linear-gradient(135deg, #E11D48 0%, #FF4500 100%)",
        "forge-gradient-subtle": "linear-gradient(135deg, rgba(225, 29, 72, 0.15) 0%, rgba(255, 69, 0, 0.15) 100%)",
        "card-gradient": "linear-gradient(180deg, rgba(28, 28, 34, 0.7) 0%, rgba(15, 15, 18, 0.9) 100%)",
        "dark-radial": "radial-gradient(circle at 50% 0%, rgba(225, 29, 72, 0.18) 0%, transparent 70%)",
      },
      boxShadow: {
        "forge-glow": "0 0 30px -5px rgba(225, 29, 72, 0.3)",
        "forge-glow-lg": "0 0 50px -5px rgba(255, 69, 0, 0.4)",
        "glass": "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float": "float 6s ease-in-out infinite",
        "glow": "glow 3s ease-in-out infinite alternate",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        glow: {
          "0%": { opacity: "0.4" },
          "100%": { opacity: "0.8" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
