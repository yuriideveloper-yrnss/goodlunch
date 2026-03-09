import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",        // Сканируем папку app
    "./components/**/*.{js,ts,jsx,tsx,mdx}", // Сканируем компоненты
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          orange: "#a85200", // Темнее для лучшего контраста (WCAG > 4.5:1 на белом фоне)
          dark: "#1F2937",   // Графит для текста
          green: "#10B981",  // Для "пользы/эко"
          bg: "#F9FAFB",     // Off-white фон
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)'], // Подключим Inter или Plus Jakarta Sans
      },
    },
  },
  plugins: [],
};
export default config;