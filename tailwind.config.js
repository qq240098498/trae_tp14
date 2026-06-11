/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        "2xl": "1440px",
      },
    },
    extend: {
      colors: {
        cyber: {
          bg: {
            primary: "#0a0a1a",
            secondary: "#1a1a2e",
            tertiary: "#16213e",
            card: "#252542",
          },
          neon: {
            cyan: "#00fff5",
            magenta: "#ff006e",
            purple: "#8b5cf6",
            yellow: "#fbbf24",
          },
          text: {
            primary: "#ffffff",
            secondary: "#a0a0c0",
            muted: "#6b6b8a",
          },
        },
      },
      fontFamily: {
        display: ["Orbitron", "sans-serif"],
        body: ["Rajdhani", "sans-serif"],
      },
      boxShadow: {
        "neon-cyan": "0 0 10px rgba(0,255,245,0.5), 0 0 20px rgba(0,255,245,0.3)",
        "neon-magenta": "0 0 10px rgba(255,0,110,0.5), 0 0 20px rgba(255,0,110,0.3)",
        "neon-glow": "0 0 30px rgba(0,255,245,0.2)",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "glow": "glow 2s ease-in-out infinite alternate",
        "float": "float 6s ease-in-out infinite",
        "fade-in-up": "fadeInUp 0.6s ease-out forwards",
      },
      keyframes: {
        glow: {
          "0%": { boxShadow: "0 0 5px rgba(0,255,245,0.3)" },
          "100%": { boxShadow: "0 0 20px rgba(0,255,245,0.8)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
