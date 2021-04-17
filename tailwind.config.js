module.exports = {
  // purge: [],
  purge: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        'banner1': '#FFE245',
        // 'p1': '#402f7e',
        // 'p1': '#ededed',
        'p1': '#ffffff',
        // 'p2': '#2a1c5e',
        'p2': '#ffffff',
        'sky1': '#828CB9',
        'sky2': '#7FABF7',
        'textColor': '#303231'
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms')({
      strategy: 'class',
    }),
  ]
};