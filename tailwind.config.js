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
        // 🎨 الألوان الرئيسية
        cream: "#FAF7F2", // الخلفية الرئيسية
        beige: "#E8DCC4", // خلفيات ثانوية
        terracotta: "#C97D60", // اللون الأساسي (أزرار وعناصر تفاعلية)
        terracottaDark: "#A45F47", // للحالات التفاعلية
        sage: "#9CAF88", // اللون الثانوي (أخضر مريمي)
        sageDark: "#7A8F6E", // نسخة أغمق
        brown: "#6B4E3D", // النصوص الرئيسية
        brownDark: "#4A3426", // نصوص أغمق
        warmWhite: "#FFFDFB", // خلفيات الكروت
        warmGray: "#A89F91", // نصوص ثانوية

        // 🔴 إضافية
        destructive: "#d4183d", // للتحذيرات والأخطاء
        border: "rgba(107, 78, 61, 0.15)", // الحدود الشفافة
      },
    },
  },
  plugins: [],
};
