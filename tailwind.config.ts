import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "#fbf9f5",
        foreground: "#1b1c1a",
        primary: {
          DEFAULT: "#000000",
          foreground: "#ffffff",
          fixed: "#e5e2e1",
          "fixed-dim": "#c8c6c5",
          "fixed-variant": "#474746",
          container: "#1c1b1b",
        },
        secondary: {
          DEFAULT: "#b22200",
          foreground: "#ffffff",
          fixed: "#ffdad3",
          "fixed-dim": "#ffb4a4",
          "fixed-variant": "#8c1800",
          container: "#d73b19",
        },
        tertiary: {
          DEFAULT: "#000000",
          foreground: "#ffffff",
          fixed: "#ffdf9a",
          "fixed-dim": "#f8be00",
          "fixed-variant": "#5a4300",
          container: "#251a00",
        },
        surface: {
          DEFAULT: "#fbf9f5",
          dim: "#dbdad6",
          bright: "#fbf9f5",
          container: "#efeeea",
          "container-lowest": "#ffffff",
          "container-low": "#f5f3ef",
          "container-high": "#eae8e4",
          "container-highest": "#e4e2de",
          variant: "#e4e2de",
          tint: "#5f5e5e",
        },
        error: {
          DEFAULT: "#ba1a1a",
          foreground: "#ffffff",
          container: "#ffdad6",
        },
        outline: {
          DEFAULT: "#747878",
          variant: "#c4c7c7",
        },
        inverse: {
          surface: "#30312e",
          "on-surface": "#f2f0ed",
          primary: "#c8c6c5",
        },
        "on-surface": "#1b1c1a",
        "on-surface-variant": "#444748",
        "on-primary-container": "#858383",
      },
      borderRadius: {
        DEFAULT: "0.125rem",
        lg: "0.25rem",
        xl: "0.5rem",
        full: "0.75rem",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      spacing: {
        gutter: "24px",
        "stack-sm": "8px",
        "stack-md": "16px",
        "stack-lg": "32px",
        "margin-mobile": "16px",
        "margin-desktop": "40px",
        unit: "8px",
        "container-max": "1440px"
      },
      fontFamily: {
        "body-md": ["var(--font-plus-jakarta)"],
        "data-mono": ["var(--font-plus-jakarta)"],
        "headline-xl": ["var(--font-playfair)"],
        "label-md": ["var(--font-plus-jakarta)"],
        "headline-lg": ["var(--font-playfair)"],
        "label-sm": ["var(--font-plus-jakarta)"],
        "headline-lg-mobile": ["var(--font-playfair)"],
        "body-lg": ["var(--font-plus-jakarta)"],
        "headline-md": ["var(--font-playfair)"]
      },
      fontSize: {
        "body-md": ["16px", { lineHeight: "1.6", fontWeight: "400" }],
        "data-mono": ["14px", { lineHeight: "1.4", letterSpacing: "-0.01em", fontWeight: "500" }],
        "headline-xl": ["48px", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "700" }],
        "label-md": ["14px", { lineHeight: "1.2", letterSpacing: "0.05em", fontWeight: "600" }],
        "headline-lg": ["32px", { lineHeight: "1.2", letterSpacing: "-0.01em", fontWeight: "700" }],
        "label-sm": ["12px", { lineHeight: "1.2", fontWeight: "500" }],
        "headline-lg-mobile": ["28px", { lineHeight: "1.2", fontWeight: "700" }],
        "body-lg": ["18px", { lineHeight: "1.6", fontWeight: "400" }],
        "headline-md": ["24px", { lineHeight: "1.3", fontWeight: "600" }]
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [tailwindcssAnimate],
} satisfies Config;

export default config;
