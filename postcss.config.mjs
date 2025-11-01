// postcss.config.mjs

/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    // Sử dụng plugin @tailwindcss/postcss cho Next.js 15
    '@tailwindcss/postcss': {},
    // Giữ lại autoprefixer
    autoprefixer: {},
  },
}

export default config
