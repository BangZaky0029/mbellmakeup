export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'serif'],
        sans: ['"Lato"', 'sans-serif'],
      },
      colors: {
        primary: '#D4A5A5',    // Dusty Rose
        secondary: '#9D8189',  // Muted Mauve
        accent: '#F4ACB7',     // Soft Pink
        surface: '#FFFCF9',    // Warm White
        textMain: '#4A403A',   // Dark Taupe
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}
