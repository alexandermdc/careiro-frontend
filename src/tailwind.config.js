/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,js,ts,jsx,tsx}",
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cinza: "hsl(var(--cinza) / <alpha-value>)",
        "fundo-claro": "hsl(var(--fundo-claro) / <alpha-value>)",
        strokes: "hsl(var(--strokes) / <alpha-value>)",
        texto: "hsl(var(--texto) / <alpha-value>)",
        "verde-claro": "hsl(var(--verde-claro) / <alpha-value>)",
        "verde-escuro": "hsl(var(--verde-escuro) / <alpha-value>)",
        input: "hsl(var(--input) / <alpha-value>)",
        ring: "hsl(var(--ring) / <alpha-value>)",
        background: "hsl(var(--background) / <alpha-value>)",
        foreground: "hsl(var(--foreground) / <alpha-value>)",
      },
      borderColor: {
        DEFAULT: "hsl(var(--border) / <alpha-value>)",
      },
      fontFamily: {
        "bot-es": "var(--bot-es-font-family)",
        sans: ["ui-sans-serif", "system-ui", "sans-serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
    container: {
      center: true,
      padding: "2rem",
      screens: { "2xl": "1400px" },
    },
  },
  darkMode: ["class"],
  plugins: [],
};
