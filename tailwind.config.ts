import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "waves":  "url('/waves.svg')",
      },
      colors: {
        "red-primary": "#BB4747",
        "gray-primary": "#E5E5E5",
      },
      fontFamily: {
        custom: ["Caveat"],
      },
      borderWidth: {
        '1': '1px',
        '6': '6px',
      },
      fontSize: {
        '1sm': '0.7rem'
      },
      boxShadow: {
        'top-md': '0 -4px 6px -1px rgba(0, 0, 0, 0.1), 0 -2px 4px -1px rgba(0, 0, 0, 0.06)'
      },
      animation: {
        'waving-hand': 'wave 3s linear 1',
      },
      keyframes: {
        wave: {
          '0%': { transform: 'rotate(0.0deg)' },
          '10%': { transform: 'rotate(34deg)' },
          '20%': { transform: 'rotate(-18deg)' },
          '30%': { transform: 'rotate(34deg)' },
          '40%': { transform: 'rotate(-24deg)' },
          '50%': { transform: 'rotate(30.0deg)' },
          '60%': { transform: 'rotate(0.0deg)' },
          '100%': { transform: 'rotate(0.0deg)' },
        },
      }

    },
  },
  plugins: [],
};
export default config;
