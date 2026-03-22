/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#f8fafc",
        foreground: "#0f172a",
        card: "#ffffff",
        border: "#e2e8f0",
        muted: "#f1f5f9",
        primary: "#0ea5e9",
        accent: "#10b981",
        destructive: "#ef4444",
      },
    },
  },
  plugins: [],
};