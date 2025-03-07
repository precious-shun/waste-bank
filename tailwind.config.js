/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        darkgreen: "#2C514B",
        normalgreen: "#4E7972",
        lightgreen: "#C2D1C8",
      },
    },
  },
  plugins: [],
};
