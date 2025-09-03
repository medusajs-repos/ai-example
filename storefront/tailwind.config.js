import uiPreset from "@medusajs/ui-preset";

export default {
  darkMode: "class",
  presets: [uiPreset],
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@medusajs/ui/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      transitionProperty: {
        width: "width margin",
        height: "height",
        bg: "background-color",
        display: "display opacity",
        visibility: "visibility",
        padding: "padding-top padding-right padding-bottom padding-left",
      },
      colors: {        
        // Medusa UI Color Variables - Reorganized based on actual color values
        // White and light grays (backgrounds)
        white: {
          DEFAULT: "var(--bg-base)", // rgba(255, 255, 255, 1)
          hover: "var(--bg-field-component-hover)", // rgba(250, 250, 250, 1)
        },
        
        gray: {
          50: "var(--bg-subtle)", // rgba(250, 250, 250, 1)
          100: "var(--bg-field-component)", // rgba(255, 255, 255, 1)
          200: "var(--bg-component)", // rgba(250, 250, 250, 1)
          300: "var(--bg-disabled)", // rgba(244, 244, 245, 1)
          400: "var(--bg-base-hover)", // rgba(244, 244, 245, 1)
          500: "#9ca3af", // Medium gray
          600: "#6b7280", // Dark gray
          700: "#4b5563", // Darker gray
          800: "#374151", // Very dark gray
          900: "#1f2937", // Darkest gray
          950: "#111827", // Almost black
        },
        
        // Blue colors (interactive elements)
        blue: {
          50: "var(--bg-highlight)", // rgba(239, 246, 255, 1)
          100: "var(--bg-highlight-hover)", // rgba(219, 234, 254, 1)
          200: "var(--bg-interactive)", // rgba(59, 130, 246, 1)
          300: "var(--border-interactive)", // rgba(59, 130, 246, 1)
          400: "var(--fg-interactive)", // rgba(59, 130, 246, 1)
          500: "var(--fg-interactive-hover)", // rgba(37, 99, 235, 1)
          600: "var(--tag-blue-text)", // rgba(30, 64, 175, 1)
          700: "var(--tag-blue-icon)", // rgba(96, 165, 250, 1)
          800: "var(--tag-blue-bg)", // rgba(219, 234, 254, 1)
          900: "var(--tag-blue-bg-hover)", // rgba(191, 219, 254, 1)
          950: "var(--tag-blue-border)", // rgba(191, 219, 254, 1)
        },
        
        // Dark colors (text and foreground)
        slate: {
          50: "var(--fg-base)", // rgba(24, 24, 27, 1)
          100: "var(--contrast-bg-base)", // rgba(24, 24, 27, 1)
          200: "var(--contrast-border-top)", // rgba(24, 24, 27, 1)
          300: "var(--fg-subtle)", // rgba(82, 82, 91, 1)
          400: "var(--button-inverted-pressed)", // rgba(82, 82, 91, 1)
          500: "var(--tag-neutral-text)", // rgba(82, 82, 91, 1)
          600: "var(--fg-muted)", // rgba(113, 113, 122, 1)
          700: "var(--fg-disabled)", // rgba(161, 161, 170, 1)
          800: "var(--tag-neutral-icon)", // rgba(161, 161, 170, 1)
          900: "var(--contrast-bg-base-hover)", // rgba(39, 39, 42, 1)
          950: "var(--button-inverted-hover)", // rgba(63, 63, 70, 1)
        },
        
        // Zinc colors (borders and neutral elements)
        zinc: {
          50: "var(--border-base)", // rgba(228, 228, 231, 1)
          100: "var(--border-menu-top)", // rgba(228, 228, 231, 1)
          200: "var(--bg-switch-off)", // rgba(228, 228, 231, 1)
          300: "var(--border-strong)", // rgba(212, 212, 216, 1)
          400: "var(--bg-switch-off-hover)", // rgba(212, 212, 216, 1)
          500: "var(--tag-neutral-border)", // rgba(228, 228, 231, 1)
          600: "var(--tag-neutral-bg-hover)", // rgba(228, 228, 231, 1)
          700: "var(--border-menu-bot)", // rgba(255, 255, 255, 1)
          800: "var(--border-transparent)", // rgba(255, 255, 255, 0)
          900: "var(--contrast-border-base)", // rgba(255, 255, 255, 0.15)
          950: "var(--contrast-border-bot)", // rgba(255, 255, 255, 0.1)
        },
        
        // Neutral colors (buttons and UI elements)
        neutral: {
          50: "var(--button-neutral)", // rgba(255, 255, 255, 1)
          100: "var(--button-neutral-hover)", // rgba(244, 244, 245, 1)
          200: "var(--button-neutral-pressed)", // rgba(228, 228, 231, 1)
          300: "var(--button-transparent-hover)", // rgba(244, 244, 245, 1)
          400: "var(--button-transparent-pressed)", // rgba(228, 228, 231, 1)
          500: "var(--button-inverted)", // rgba(39, 39, 42, 1)
          600: "var(--contrast-bg-subtle)", // rgba(39, 39, 42, 1)
          700: "var(--contrast-bg-base-pressed)", // rgba(63, 63, 70, 1)
          800: "var(--button-transparent)", // rgba(255, 255, 255, 0)
          900: "var(--alpha-250)", // rgba(24, 24, 27, 0.1)
          950: "var(--alpha-400)", // rgba(24, 24, 27, 0.24)
        },
        
        // Red colors (errors and danger)
        red: {
          50: "var(--tag-red-bg)", // rgba(255, 228, 230, 1)
          100: "var(--tag-red-bg-hover)", // rgba(254, 205, 211, 1)
          200: "var(--tag-red-border)", // rgba(254, 205, 211, 1)
          300: "var(--tag-red-icon)", // rgba(244, 63, 94, 1)
          400: "var(--tag-red-text)", // rgba(159, 18, 57, 1)
          500: "var(--border-error)", // rgba(225, 29, 72, 1)
          600: "var(--button-danger)", // rgba(225, 29, 72, 1)
          700: "var(--fg-error)", // rgba(225, 29, 72, 1)
          800: "var(--border-danger)", // rgba(190, 18, 60, 1)
          900: "var(--button-danger-hover)", // rgba(190, 18, 60, 1)
          950: "var(--button-danger-pressed)", // rgba(159, 18, 57, 1)
        },
        
        // Green colors
        green: {
          50: "var(--tag-green-bg)", // rgba(209, 250, 229, 1)
          100: "var(--tag-green-bg-hover)", // rgba(167, 243, 208, 1)
          200: "var(--tag-green-border)", // rgba(167, 243, 208, 1)
          300: "var(--tag-green-icon)", // rgba(16, 185, 129, 1)
          400: "var(--tag-green-text)", // rgba(6, 95, 70, 1)
        },
        
        // Orange colors
        orange: {
          50: "var(--tag-orange-bg)", // rgba(255, 237, 213, 1)
          100: "var(--tag-orange-bg-hover)", // rgba(254, 215, 170, 1)
          200: "var(--tag-orange-border)", // rgba(254, 215, 170, 1)
          300: "var(--tag-orange-icon)", // rgba(249, 115, 22, 1)
          400: "var(--tag-orange-text)", // rgba(154, 52, 18, 1)
        },
        
        // Purple colors
        purple: {
          50: "var(--tag-purple-bg)", // rgba(237, 233, 254, 1)
          100: "var(--tag-purple-bg-hover)", // rgba(221, 214, 254, 1)
          200: "var(--tag-purple-border)", // rgba(221, 214, 254, 1)
          300: "var(--tag-purple-icon)", // rgba(167, 139, 250, 1)
          400: "var(--tag-purple-text)", // rgba(91, 33, 182, 1)
        },
        
        // Stone colors (neutral tags)
        stone: {
          50: "var(--tag-neutral-bg)", // rgba(244, 244, 245, 1)
          100: "var(--tag-neutral-bg-hover)", // rgba(228, 228, 231, 1)
          200: "var(--tag-neutral-text)", // rgba(82, 82, 91, 1)
          300: "var(--tag-neutral-border)", // rgba(228, 228, 231, 1)
          400: "var(--tag-neutral-icon)", // rgba(161, 161, 170, 1)
        },
        
        // Amber colors (contrast elements)
        amber: {
          50: "var(--contrast-fg-primary)", // rgba(255, 255, 255, 0.88)
          100: "var(--fg-on-color)", // rgba(255, 255, 255, 1)
          200: "var(--fg-on-inverted)", // rgba(255, 255, 255, 1)
          300: "var(--contrast-fg-secondary)", // rgba(255, 255, 255, 0.56)
          400: "var(--bg-overlay)", // rgba(24, 24, 27, 0.4)
        },
        
        // Transparent colors
        transparent: {
          DEFAULT: "transparent",
          250: "var(--alpha-250)", // rgba(24, 24, 27, 0.1)
          400: "var(--alpha-400)", // rgba(24, 24, 27, 0.24)
        },
      },
      borderRadius: {
        none: "0px",
        soft: "2px",
        base: "4px",
        rounded: "8px",
        large: "16px",
        circle: "9999px",
      },
      maxWidth: {
        "8xl": "100rem",
      },
      screens: {
        "2xsmall": "320px",
        xsmall: "512px",
        small: "1024px",
        medium: "1280px",
        large: "1440px",
        xlarge: "1680px",
        "2xlarge": "1920px",
      },
      fontSize: {
        "3xl": "2rem",
      },
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Ubuntu",
          "sans-serif",
        ],
      },
      keyframes: {
        ring: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "fade-in-right": {
          "0%": {
            opacity: "0",
            transform: "translateX(10px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateX(0)",
          },
        },
        "fade-in-top": {
          "0%": {
            opacity: "0",
            transform: "translateY(-10px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        "fade-out-top": {
          "0%": {
            height: "100%",
          },
          "99%": {
            height: "0",
          },
          "100%": {
            visibility: "hidden",
          },
        },
        "accordion-slide-up": {
          "0%": {
            height: "var(--radix-accordion-content-height)",
            opacity: "1",
          },
          "100%": {
            height: "0",
            opacity: "0",
          },
        },
        "accordion-slide-down": {
          "0%": {
            "min-height": "0",
            "max-height": "0",
            opacity: "0",
          },
          "100%": {
            "min-height": "var(--radix-accordion-content-height)",
            "max-height": "none",
            opacity: "1",
          },
        },
        enter: {
          "0%": { transform: "scale(0.9)", opacity: 0 },
          "100%": { transform: "scale(1)", opacity: 1 },
        },
        leave: {
          "0%": { transform: "scale(1)", opacity: 1 },
          "100%": { transform: "scale(0.9)", opacity: 0 },
        },
        "slide-in": {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(0)" },
        },
      },
      animation: {
        ring: "ring 2.2s cubic-bezier(0.5, 0, 0.5, 1) infinite",
        "fade-in-right":
          "fade-in-right 0.3s cubic-bezier(0.5, 0, 0.5, 1) forwards",
        "fade-in-top": "fade-in-top 0.2s cubic-bezier(0.5, 0, 0.5, 1) forwards",
        "fade-out-top":
          "fade-out-top 0.2s cubic-bezier(0.5, 0, 0.5, 1) forwards",
        "accordion-open":
          "accordion-slide-down 300ms cubic-bezier(0.87, 0, 0.13, 1) forwards",
        "accordion-close":
          "accordion-slide-up 300ms cubic-bezier(0.87, 0, 0.13, 1) forwards",
        enter: "enter 200ms ease-out",
        "slide-in": "slide-in 1.2s cubic-bezier(.41,.73,.51,1.02)",
        leave: "leave 150ms ease-in forwards",
      },
    },
  },
  plugins: [],
};
