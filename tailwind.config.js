/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {}
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        retro: {
          'color-scheme': 'light',
          primary: '#ef9995',
          'primary-content': '#282425',
          secondary: '#a4cbb4',
          'secondary-content': '#282425',
          accent: '#ebdc99',
          'accent-content': '#282425',
          neutral: '#7d7259',
          'neutral-content': '#e4d8b4',
          'base-100': '#e4d8b4',
          'base-200': '#d2c59d',
          'base-300': '#c6b386',
          'base-content': '#282425',
          info: '#2563eb',
          success: '#16a34a',
          warning: '#Ffcc00',
          error: '#dc2626',
          '--rounded-box': '0.4rem',
          '--rounded-btn': '0.4rem',
          '--rounded-badge': '0.4rem'
        }
      }
    ]
  }
}
