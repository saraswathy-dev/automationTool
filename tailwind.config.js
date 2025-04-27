/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        muted: "#71717A",
        "custom-foreground": "#8080A",
        light: "#E3E3E7",
      },
    },
  },
  plugins: [],
};
