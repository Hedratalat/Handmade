/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
        playfair: ["Playfair Display", "serif"],
      },
      colors: {
        // 🎨 الألوان الرئيسية (مأخوذة من ألوان اللوجو)
        cream: "#FCEDF0", // الخلفية الرئيسية (وردي اللوجو)
        beige: "#F3D8DE", // خلفيات ثانوية
        terracotta: "#5F1D2E", // اللون الأساسي (أزرار وعناصر تفاعلية) - عنابي اللوجو
        terracottaDark: "#431322", // للحالات التفاعلية
        sage: "#A65F70", // اللون الثانوي (وردي مغبّر)
        sageDark: "#85465A", // نسخة أغمق
        brown: "#4B1626", // النصوص الرئيسية
        brownDark: "#33101B", // نصوص أغمق
        warmWhite: "#FFF8F9", // خلفيات الكروت
        warmGray: "#9A7F86", // نصوص ثانوية

        // 🔴 إضافية
        destructive: "#d4183d", // للتحذيرات والأخطاء
        border: "rgba(95, 29, 46, 0.15)", // الحدود الشفافة
      },
    },
  },
  plugins: [],
};
