/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./store/**/*.{ts,tsx}",
    "./types/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#0055AA",
          foreground: "#FFFFFF",
          50: "#E6F0FA",
          100: "#C2D9F2",
          200: "#8BB8E5",
          300: "#5497D8",
          400: "#2A7BC8",
          500: "#0055AA",
          600: "#004488",
          700: "#003366",
          800: "#002244",
          900: "#001122",
        },
        secondary: {
          DEFAULT: "#273C6F",
          foreground: "#FFFFFF",
        },
        accent: {
          DEFAULT: "#F58220",
          foreground: "#FFFFFF",
        },
        muted: {
          DEFAULT: "#F1F5F9",
          foreground: "#64748B",
        },
        destructive: {
          DEFAULT: "#EF4444",
          foreground: "#FFFFFF",
        },
        card: {
          DEFAULT: "#FFFFFF",
          foreground: "#0F172A",
        },
        border: "#E2E8F0",
        input: "#E2E8F0",
        ring: "#0055AA",
        background: "#F8FAFC",
        foreground: "#0F172A",
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        lg: "0.75rem",
        md: "0.5rem",
        sm: "0.25rem",
      },
      boxShadow: {
        card: "0 1px 3px 0 rgb(0 0 0 / 0.05), 0 1px 2px -1px rgb(0 0 0 / 0.05)",
        "card-hover": "0 10px 15px -3px rgb(0 0 0 / 0.05), 0 4px 6px -4px rgb(0 0 0 / 0.05)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
