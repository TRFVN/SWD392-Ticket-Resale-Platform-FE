/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class", // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        footer: "#1A2129",
        dark: {
          primary: "#0f172a", // Xanh đen - dark slate blue
          secondary: "#1e293b", // Xanh đen nhạt hơn
          accent: "#334155", // Xanh đen accent
        },
        light: {
          primary: "#ffffff",
          secondary: "#f1f5f9", // Light blue gray
          accent: "#e2e8f0", // Lighter blue gray
        },
        // Giữ màu cam chủ đạo
        primary: {
          light: "#F97316", // Light orange - orange-500
          DEFAULT: "#EA580C", // Base color - orange-600
          dark: "#C2410C", // Dark shade - orange-700
        },
        manager: {
          primary: "#111727",
          secondary: "#1E2938",
          third: "#606773",
        },
      },
      backgroundImage: {
        header:
          "https://static.vecteezy.com/system/resources/thumbnails/028/889/619/small_2x/generative-ai-people-crowd-on-music-rock-festival-concert-in-stadium-big-stage-lit-by-spotlights-photo.jpg",
        "gradient-event": "linear-gradient(135deg, #F97316 0%, #C2410C 100%)", // Orange gradient
        "gradient-ticket": "linear-gradient(135deg, #FB923C 0%, #EA580C 100%)", // Light to dark orange
        "gradient-dark": "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)", // Dark blue gradient
      },
      animation: {
        "gradient-x": "gradient-x 15s ease infinite",
        "gradient-y": "gradient-y 15s ease infinite",
        "gradient-xy": "gradient-xy 15s ease infinite",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "ticket-float": "float 6s ease-in-out infinite",
        "fade-in": "fadeIn 0.5s ease-out",
      },
      keyframes: {
        "gradient-y": {
          "0%, 100%": {
            "background-size": "400% 400%",
            "background-position": "center top",
          },
          "50%": {
            "background-size": "200% 200%",
            "background-position": "center center",
          },
        },
        "gradient-x": {
          "0%, 100%": {
            "background-size": "200% 200%",
            "background-position": "left center",
          },
          "50%": {
            "background-size": "200% 200%",
            "background-position": "right center",
          },
        },
        "gradient-xy": {
          "0%, 100%": {
            "background-size": "400% 400%",
            "background-position": "left center",
          },
          "50%": {
            "background-size": "200% 200%",
            "background-position": "right center",
          },
        },
        float: {
          "0%, 100%": {
            transform: "translateY(0)",
          },
          "50%": {
            transform: "translateY(-10px)",
          },
        },
        fadeIn: {
          "0%": {
            opacity: "0",
          },
          "100%": {
            opacity: "1",
          },
        },
      },
      boxShadow: {
        ticket:
          "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        "ticket-hover":
          "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        "event-card":
          "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      },
      borderRadius: {
        ticket: "1rem",
        event: "0.75rem",
      },
      height: {
        ticket: "10rem",
        hero: "85vh",
      },
      fontSize: {
        display: ["4rem", { lineHeight: "1.2" }],
        "event-title": [
          "1.875rem",
          { lineHeight: "2.25rem", fontWeight: "700" },
        ],
      },
      transitionDuration: {
        400: "400ms",
      },
    },
  },
  plugins: [],
};
