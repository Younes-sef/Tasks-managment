/** @type {import('tailwindcss').Config} */
export default {
    darkMode: "class", // enable dark mode via class strategy
    content: [
      "./app/**/*.{js,ts,jsx,tsx}",
      "./pages/**/*.{js,ts,jsx,tsx}",
      "./components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {},
    },
    plugins: [],
  };
  