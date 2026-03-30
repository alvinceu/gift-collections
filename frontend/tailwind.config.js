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
        base: {
          dark: '#0D0D0F',
          light: '#F7ECE6',
          accent: '#CAA07D',
        },
        light: {
          bg: {
            primary: '#F7ECE6',
            secondary: '#FFFFFF',
            elevated: '#FFF7F2',
          },
          text: {
            primary: '#1A1A1D',
            secondary: '#5F5A56',
            muted: '#9C948E',
            disabled: '#CFC6BF',
          },
          accent: {
            primary: '#CAA07D',
            hover: '#B88B67',
            soft: '#EAD5C3',
          },
          border: {
            light: '#E6DAD2',
            divider: '#EFE4DD',
          },
          status: {
            success: '#5F8F72',
            warning: '#D2A24C',
            error: '#C46A5A',
          },
        },
        dark: {
          bg: {
            primary: '#0D0D0F',
            secondary: '#141417',
            card: '#1B1B1F',
            hover: '#232327',
          },
          text: {
            primary: '#F4EFEA',
            secondary: '#C9C3BD',
            muted: '#8E8883',
            disabled: '#5E5A56',
          },
          accent: {
            primary: '#CAA07D',
            hover: '#E0B48F',
            soft: '#CAA07D33',
          },
          border: {
            dark: '#2A2A2E',
            divider: '#1F1F23',
          },
          status: {
            success: '#6FAF8A',
            warning: '#E0B85C',
            error: '#D07A6A',
          },
        },
        accent: {
          50: '#F5EDE4',
          100: '#EAD5C3',
          200: '#E0B48F',
          300: '#CAA07D',
          400: '#B88B67',
          500: '#CAA07D',
          600: '#B88B67',
          700: '#A6754F',
          800: '#8E5F37',
          900: '#76491F',
        },
        primary: {
          50: '#F5EDE4',
          100: '#EAD5C3',
          200: '#E0B48F',
          300: '#CAA07D',
          400: '#B88B67',
          500: '#CAA07D',
          600: '#B88B67',
          700: '#A6754F',
          800: '#8E5F37',
          900: '#76491F',
        },
      },
      backgroundImage: {
        'gradient-light': 'linear-gradient(to bottom, #F7ECE6, #FFF7F2)',
        'gradient-dark': 'linear-gradient(to bottom, #0D0D0F, #1B1B1F)',
      },
    },
  },
  plugins: [],
}
