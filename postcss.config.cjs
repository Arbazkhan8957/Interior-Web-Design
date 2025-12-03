// postcss.config.cjs
module.exports = {
  plugins: {
    '@tailwindcss/postcss': {},  // ✅ new required plugin
    autoprefixer: {},
  },
};
