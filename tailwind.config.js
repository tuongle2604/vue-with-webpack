const { isProduction } = require("webpack-mode");

module.exports = {
  purge: {
    enabled: isProduction,
    content: ["./src/**/*.html", "./src/**/*.vue"]
  },
  theme: {
    spacing: {
      px: '1px',
      '0': '0',
      '1': '0.5rem',
      '2': '1rem',
      '3': '1.5rem',
      '4': '2rem',
      '5': '2.5rem',
      '6': '3rem',
      '8': '4rem',
      '10': '5rem',
      '12': '6rem',
      '16': '8rem',
      '20': '10rem',
      '24': '12rem',
      '32': '16rem',
      '40': '20rem',
      '48': '24rem',
      '56': '28rem',
      '64': '32rem',
    },
    fontSize: {
      'sm': '0.8rem',
      // 'lg': '2rem',
      'base': '1rem',
      '1rem': '1rem',
      '2rem': '2rem',
      '3rem': '3rem',
      '4rem': '4rem',
      '5rem': '5rem',
      '6rem': '6rem',
      '7rem': '7rem',
      '8rem': '8rem',
      '9rem': '9rem',
      '10rem': '10rem',
    }
  },
  variants: {},
  plugins: []
};
