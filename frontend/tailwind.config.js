/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Colors inspired by Indian government portals (navy + saffron + green)
        navy: {
          DEFAULT: "#0B3D63",
          dark: "#062845",
          light: "#12507F",
        },
        saffron: "#FF9933",
        indiagreen: "#138808",
        gold: "#D4A017",
        cream: "#FAF7F0",
      },
      fontFamily: {
        sans: ["Inter", "Segoe UI", "sans-serif"],
        heading: ["Poppins", "Segoe UI", "sans-serif"],
      },
      boxShadow: {
        card: "0 4px 20px rgba(11, 61, 99, 0.08)",
        "card-hover": "0 8px 30px rgba(11, 61, 99, 0.15)",
        glow: "0 0 40px rgba(255, 153, 51, 0.25)",
      },
      keyframes: {
        blob: {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "33%": { transform: "translate(20px, -30px) scale(1.1)" },
          "66%": { transform: "translate(-15px, 15px) scale(0.95)" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        spinSlow: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
      animation: {
        blob: "blob 12s infinite ease-in-out",
        "fade-in-up": "fadeInUp 0.6s ease-out both",
        "spin-slow": "spinSlow 40s linear infinite",
      },
    },
  },
  plugins: [],
};
