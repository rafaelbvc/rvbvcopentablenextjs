/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
    screens: {
      sm: "320px",
      md: "769px",
      lg: "1025px",
      xlg: "1280px",
    },

    fontSize: {
      "2xsm": "10px",
      xsm: "12px",
      sm: "13px",
      reg: "15px",
      lg: "18px",
      xl: "20px",
      "1xl": "21px",
      "2xl": "22px",
      "3xl": "25px",
      "4xl": "32px",
      "4/5xl": "37px",
      "5xl": "40px",
      "6xl": "50px",
      "7xl": "70px",
    },
  },
  plugins: [],
};
