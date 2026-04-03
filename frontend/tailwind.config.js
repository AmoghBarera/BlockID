export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Poppins", "sans-serif"],
        body: ["DM Sans", "sans-serif"]
      },
      colors: {
        brand: {
          500: "#0f766e",
          700: "#115e59",
          900: "#0b2f33"
        }
      },
      boxShadow: {
        glass: "0 20px 60px rgba(15, 23, 42, 0.35)"
      },
      keyframes: {
        floatUp: {
          "0%": { opacity: 0, transform: "translateY(12px)" },
          "100%": { opacity: 1, transform: "translateY(0)" }
        }
      },
      animation: {
        floatUp: "floatUp 0.5s ease forwards"
      }
    }
  },
  plugins: []
};
