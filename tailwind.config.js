// tailwind.config.js
module.exports = {
    content: [
      "./pages/**/*.{js,ts,jsx,tsx,mdx}",
      "./components/**/*.{js,ts,jsx,tsx,mdx}",
      "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
      extend: {
        fontFamily: {
          orbitron: ['Orbitron', 'sans-serif'],
          oxanium: ['Oxanium', 'sans-serif'],
          audiowide: ['Audiowide', 'cursive'],
        },
      },
    },
    plugins: [],
  };
  