import { heroui } from "@heroui/react"
import type { Config } from "tailwindcss"

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "../../node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#000000",
        foreground: "#ffffff",
        primary: {
          DEFAULT: "#ff9000",
          hover: "#ff7300",
          50: "#fffbec",
          100: "#fff7d3",
          200: "#ffeba5",
          300: "#ffda6d",
          400: "#ffbf32",
          500: "#ffa70a",
          600: "#ff9000",
          700: "#cc6a02",
          800: "#a1510b",
          900: "#82440c",
          950: "#462104",
        },
        secondary: {
          DEFAULT: "#1b1b1b",
          hover: "#2d2d2d",
        },
      },
      fontFamily: {
        sans: ["Roboto", "sans-serif"],
      },
    },
  },
  darkMode: "class",
  plugins: [heroui()],
} satisfies Config
