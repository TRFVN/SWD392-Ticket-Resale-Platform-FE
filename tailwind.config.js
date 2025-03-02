/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class", // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        footer: "#1A2129",
        dark: {
          primary: "#1a1a1a",
          secondary: "#2d2d2d",
          accent: "#3d3d3d",
        },
        light: {
          primary: "#ffffff",
          secondary: "#f3f4f6",
          accent: "#e5e7eb",
        },
        // TicketHub brand colors
        primary: {
          light: "#F97316", // Light orange - orange-500
          DEFAULT: "#EA580C", // Base color - orange-600
          dark: "#C2410C", // Dark shade - orange-700
        },
      },
      backgroundImage: {
        header:
          "https://static.vecteezy.com/system/resources/thumbnails/028/889/619/small_2x/generative-ai-people-crowd-on-music-rock-festival-concert-in-stadium-big-stage-lit-by-spotlights-photo.jpg",
      },
      animation: {
        "gradient-x": "gradient-x 15s ease infinite",
        "gradient-y": "gradient-y 15s ease infinite",
        "gradient-xy": "gradient-xy 15s ease infinite",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
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
      },
    },
  },
  plugins: [],
};
