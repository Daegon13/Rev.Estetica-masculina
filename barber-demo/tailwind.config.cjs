/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,ts,tsx,md,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: { 950: "#07090B", 900: "#0B0F13", 850: "#0E141A", 800: "#111A22" },

        // Antes: cyanA: { 500: "#22D3EE" }
        // Ahora: dorado premium
        cyanA: { 500: "#D4AF37" }
      },
      boxShadow: {
        soft: "0 10px 30px rgba(0,0,0,.35)",

        // Antes:
        // glow: "0 0 0 1px rgba(34,211,238,.15), 0 18px 50px rgba(0,0,0,.45)"
        // Ahora: dorado + menos invasivo
        glow: "0 0 0 1px rgba(212,175,55,.12), 0 18px 50px rgba(0,0,0,.45)"
      }
    }
  },
  plugins: []
};
