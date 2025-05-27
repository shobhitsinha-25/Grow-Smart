module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        rye: ['"Rye"', 'cursive'],
      },
      animation: {
        signuprotateOrbit: 'signuprotateOrbit 16s infinite ease-in-out',
        signinrotateOrbit: 'signinrotateOrbit 16s infinite ease-in-out',
        forgotzoomInOut: 'forgotzoomInOut 12s infinite',
        resetzoomInOut: 'resetzoomInOut 12s infinite',
      },
      keyframes: {
        signuprotateOrbit: {
          '0%': { transform: 'rotate(0deg)', opacity: 0.25 },
          '50%': { transform: 'rotate(25deg)', opacity: 0.25 },
          '100%': { transform: 'rotate(0deg)', opacity: 0.25 },
        },
        signinrotateOrbit: {
          '0%': { transform: 'rotate(0deg)', opacity: 0.5 },
          '50%': { transform: 'rotate(25deg)', opacity: 0.5 },
          '100%': { transform: 'rotate(0deg)', opacity: 0.5 },
        },
        forgotzoomInOut: {
          '0%, 100%': {
            transform: 'scale(1)', 
          },
          '50%': {
            transform: 'scale(1.1)', 
          },
        },
        resetzoomInOut: {
          '0%, 100%': {
            transform: 'scale(1)', 
          },
          '50%': {
            transform: 'scale(1.1)', 
          },
        },
      },
      colors: {
        'light-purple': '#ac00e6', 
      },
    },
  },
  plugins: [],
};
