/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      colors: {
        mbell: {
          canvas: '#FCF9F6',    // Latar utama hangat
          surface: '#F4EBE6',   // Latar sekunder / kartu
          blush: '#EBD8D0',     // Aksen lembut
          rose: '#C88A82',      // Dusty rose (aksen interaktif)
          primary: '#9E5A54',   // Deep rosewood (CTA utama)
          ink: '#2A2121',       // Teks utama (espresso)
          muted: '#786866',     // Teks sekunder (taupe)
          border: '#E6D7D2',    // Garis pemisah halus
        },
        // Backward-compatibility aliases to preserve existing UI harmony
        primary: '#9E5A54',
        secondary: '#C88A82',
        accent: '#EBD8D0',
        surface: '#FCF9F6',
        textMain: '#2A2121',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
};
