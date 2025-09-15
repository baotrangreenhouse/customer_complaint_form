/**
 * PostCSS Configuration
 * 
 * PostCSS is a tool for transforming CSS with JavaScript plugins.
 * This configuration tells PostCSS to use Tailwind CSS v4.
 * 
 * The @tailwindcss/postcss plugin processes Tailwind's CSS utilities
 * and applies them during the build process.
 */
const config = {
  plugins: ["@tailwindcss/postcss"],
};

export default config;
