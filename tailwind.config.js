/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {
      backgroundColor:{
        'bg-yellow': '#eff1e0'
      },
      backgroundImage:{
        'auth-bg':  "linear-gradient(to right, rgba(55, 65, 81,.2), rgba(17, 24, 39,0.4), rgba(0, 0, 0,.2)), url('D:/ZIEGLAR BYTE/PROJECT/project/src/ASSETS/IMAGES/auth-bg.jpg')"
      },
      colors:{
        'text-gray': "#4a4a4c"
      }
    },
  },
  plugins: [],
}