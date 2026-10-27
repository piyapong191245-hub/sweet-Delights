import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./context/**/*.{ts,tsx}",
    "./data/**/*.{ts,tsx}",
  ],
  // คลาสสีของแท็กสินค้าถูกเก็บในข้อมูล (data/products.ts) จึงอยู่ในไฟล์ที่สแกนอยู่แล้ว
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#fffbf5",
          100: "#fff3e1",
          200: "#ffe4c2",
          300: "#ffd099",
          400: "#ffb366",
          500: "#f98d2a",
          600: "#e06f13",
          pink: "#fce7f3",
          rose: "#fda4af",
          cream: "#FAF6F0",
          accent: "#e11d48",
        },
      },
      fontFamily: {
        sans: ["Prompt", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
