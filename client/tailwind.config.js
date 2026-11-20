/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          teal: {
            DEFAULT: '#128F80',
            50: '#EBF7F5',
            100: '#D2F0EB',
            200: '#A7E1D8',
            300: '#7CD2C4',
            400: '#3CBBA7',
            500: '#128F80',
            600: '#087568',
            700: '#065D53',
            800: '#04463E',
            900: '#022E29',
          },
          coral: {
            DEFAULT: '#F45B48',
            50: '#FEF3F1',
            100: '#FDE4E1',
            200: '#FBC5BF',
            300: '#F79D92',
            400: '#F47768',
            500: '#F45B48',
            600: '#DE3C24',
            700: '#B02C18',
            800: '#8A2516',
            900: '#47130B',
          },
          orange: {
            DEFAULT: '#F45B48',
            500: '#F45B48',
          },
          navy: '#171B25',
          dark: '#171B25',
          gray: '#64748B',
          lightBg: '#F7F9FC',
          border: '#E5EAF0',
          success: '#16A36A',
          warning: '#F4B740',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['"Plus Jakarta Sans"', 'Poppins', 'sans-serif'],
        jakarta: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        'card': '0 10px 30px -5px rgba(19, 139, 122, 0.08)',
        'card-hover': '0 20px 40px -10px rgba(19, 139, 122, 0.16)',
        'float': '0 15px 35px -5px rgba(21, 27, 36, 0.12)',
      },
      animation: {
        'float-slow': 'float 6s ease-in-out infinite',
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}

