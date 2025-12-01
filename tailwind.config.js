/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./context/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#007AFF',
          light: '#E3F2FD',
          dark: '#0051D5',
        },
        success: {
          DEFAULT: '#34C759',
          light: '#E8F8EC',
        },
        warning: {
          DEFAULT: '#FF9500',
          light: '#FFF4E5',
        },
        danger: {
          DEFAULT: '#FF3B30',
          light: '#FFE8E6',
        },
        info: {
          DEFAULT: '#5AC8FA',
          light: '#E5F6FD',
        },
        gray: {
          50: '#F9F9F9',
          100: '#EEEEEE',
          200: '#DDDDDD',
          300: '#CCCCCC',
          400: '#999999',
          500: '#666666',
          600: '#555555',
          700: '#333333',
          800: '#282323',
          900: '#1A1A1A',
        },
      },
      spacing: {
        'xs': '4px',
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '24px',
        '2xl': '32px',
        '3xl': '40px',
        '4xl': '48px',
        '5xl': '64px',
      },
      borderRadius: {
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        '2xl': '20px',
      },
      fontSize: {
        'xs': '12px',
        'sm': '13px',
        'base': '15px',
        'lg': '16px',
        'xl': '18px',
        '2xl': '20px',
        '3xl': '24px',
        '4xl': '28px',
        '5xl': '32px',
        '6xl': '40px',
      },
    },
  },
  plugins: [],
}

