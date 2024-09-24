/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        footer: "#1A2129",
      },
      backgroundImage: {
        header:
          "https://static.vecteezy.com/system/resources/thumbnails/028/889/619/small_2x/generative-ai-people-crowd-on-music-rock-festival-concert-in-stadium-big-stage-lit-by-spotlights-photo.jpg",
      },
    },
  },
  plugins: [],
};
