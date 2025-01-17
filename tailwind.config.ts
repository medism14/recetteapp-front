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
          padding: "8px",
          "@screen sm": {
            padding: "8px 16px",
          },
          "@screen md": {
            padding: "8px 24px",
          },
          "@screen lg": {
            padding: "8px 40px",
          },
          "@screen xl": {
            padding: "8px 70px",
          },
          "@screen 2xl": {
            padding: "8px 90px",
          },
        },
        ".containerExterne": {
          padding: "8px",
          margin: "0 2px",
          "@screen sm": {
            margin: "0 4px",
          },
          "@screen md": {
            margin: "0 16px",
          },
          "@screen lg": {
            margin: "0 30px",
          },
          "@screen xl": {
            margin: "0 50px",
          },
          "@screen 2xl": {
            margin: "0 70px",
          },
        },
      });
    }),
    require("@tailwindcss/line-clamp")
  ],
};
