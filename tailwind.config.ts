/** @format */

const plugin = require("tailwindcss/plugin");

module.exports = {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#6A7F96",
        secondary: "#2C3E50",
        tertiary: "#D69A65",
        success: "#D96C06", 
        danger: "#F5F7FA", 
        textColor: "#2D3748",
      },
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
      },
    },
  },
  plugins: [
    plugin(function ({ addComponents }: { addComponents: any }) {
      addComponents({
        ".containerInterne": {
          padding: "20px",
          "@screen sm": {
            padding: "20px 30px",
          },
          "@screen md": {
            padding: "20px 60px",
          },
          "@screen lg": {
            padding: "20px 100px",
          },
          "@screen xl": {
            padding: "20px 150px",
          },
          "@screen 2xl": {
            padding: "20px 180px",
          },
        },
        ".containerExterne": {
          padding: "20px",
          margin: "0 10px",
          "@screen sm": {
            margin: "0 20px",
          },
          "@screen md": {
            margin: "0 60px",
          },
          "@screen lg": {
            margin: "0 100px",
          },
          "@screen xl": {
            margin: "0 150px",
          },
          "@screen 2xl": {
            margin: "0 180px",
          },
        },
      });
    }),
    require("@tailwindcss/line-clamp")
  ],
};
