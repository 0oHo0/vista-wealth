/** @type {import('tailwindcss').Config} */
import animate from "tailwindcss-animate";

export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        /* ---- 浅色 Apple / Wealthfront 基调 ---- */
        cream: "#FAF9F6",
        paper: "#FFFFFF",
        ink: "#17191C",
        "ink-soft": "rgba(23,25,28,.62)",
        "ink-faint": "rgba(23,25,28,.38)",
        "hairline": "rgba(23,25,28,.08)",
        /* ---- 品牌色 ---- */
        gold: {
          DEFAULT: "#B08D57",
          soft: "#D9C39B",
          faint: "rgba(176,141,87,.14)"
        },
        teal: {
          DEFAULT: "#0E7C6B"
        }
      },
      fontFamily: {
        sans: [
          "-apple-system", "BlinkMacSystemFont", "SF Pro Display", "SF Pro Text",
          "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "sans-serif"
        ]
      },
      borderRadius: {
        "4xl": "2rem"
      },
      boxShadow: {
        card: "0 1px 2px rgba(23,25,28,.04), 0 8px 32px rgba(23,25,28,.05)",
        pop: "0 2px 6px rgba(23,25,28,.06), 0 18px 50px rgba(23,25,28,.09)"
      },
      keyframes: {
        "fade-up": {
          from: { opacity: "0", transform: "translateY(14px)" },
          to: { opacity: "1", transform: "translateY(0)" }
        }
      },
      animation: {
        "fade-up": "fade-up .7s cubic-bezier(.22,1,.36,1) both"
      }
    }
  },
  plugins: [animate]
};
