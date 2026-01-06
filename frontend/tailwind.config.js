/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        helvetica: [
          "Helvetica",
          "Helvetica Neue",
          "Arial",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "sans-serif",
        ],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        // Aurora Glass (design.json)
        ink: {
          base: "#060B0D",
          raised: "#0B1115",
          overlay: "#0E151B",
        },
        aurora: {
          cyan: "#3BD6FF",
          violet: "#9B6DFF",
          green: "#3FE264",
        },
        // Vanish AI Brand Colors
        void: {
          black: "#0B0B0D",
          DEFAULT: "#0B0B0D",
        },
        electric: {
          blue: "#2F80FF",
          DEFAULT: "#2F80FF",
        },
        neon: {
          violet: "#7C4DFF",
          DEFAULT: "#7C4DFF",
        },
        graphite: "#1E1E22",
        muted: {
          gray: "#8A8A8F",
          DEFAULT: "#8A8A8F",
        },
        // Shadcn compatibility
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "#2F80FF", // Electric Blue
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "#8A8A8F",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "#2F80FF",
          foreground: "#FFFFFF",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "#2F80FF",
      },
    },
  },
  plugins: [],
}

