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
      },
      backgroundImage: {
        header:
          "https://static.vecteezy.com/system/resources/thumbnails/028/889/619/small_2x/generative-ai-people-crowd-on-music-rock-festival-concert-in-stadium-big-stage-lit-by-spotlights-photo.jpg",
      },
    },
  },
  plugins: [],
};
