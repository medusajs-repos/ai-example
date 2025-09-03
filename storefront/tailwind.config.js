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
        // Medusa UI Color Variables - Reorganized with traditional color names
        // Gray colors (backgrounds)
        gray: {
          50: "var(--bg-base)",
          100: "var(--bg-base-hover)",
          200: "var(--bg-base-pressed)",
          300: "var(--bg-component)",
          400: "var(--bg-component-hover)",
          500: "var(--bg-component-pressed)",
          600: "var(--bg-subtle)",
          700: "var(--bg-subtle-hover)",
          800: "var(--bg-subtle-pressed)",
          900: "var(--bg-field)",
          950: "var(--bg-field-hover)",
        },
        
        // White colors (field components)
        white: {
          DEFAULT: "var(--bg-field-component)",
          hover: "var(--bg-field-component-hover)",
        },
        
        // Blue colors (interactive elements)
        blue: {
          50: "var(--bg-interactive)",
          100: "var(--bg-highlight)",
          200: "var(--bg-highlight-hover)",
          300: "var(--bg-disabled)",
          400: "var(--bg-overlay)",
          500: "var(--bg-switch-off)",
          600: "var(--bg-switch-off-hover)",
        },
        
        // Text colors (foreground)
        slate: {
          50: "var(--fg-base)",
          100: "var(--fg-subtle)",
          200: "var(--fg-muted)",
          300: "var(--fg-disabled)",
          400: "var(--fg-on-color)",
          500: "var(--fg-on-inverted)",
          600: "var(--fg-interactive)",
          700: "var(--fg-interactive-hover)",
          800: "var(--fg-error)",
        },
        
        // Border colors
        zinc: {
          50: "var(--border-base)",
          100: "var(--border-strong)",
          200: "var(--border-interactive)",
          300: "var(--border-error)",
          400: "var(--border-danger)",
          500: "var(--border-transparent)",
          600: "var(--border-menu-top)",
          700: "var(--border-menu-bot)",
        },
        
        // Button colors
        neutral: {
          50: "var(--button-neutral)",
          100: "var(--button-neutral-hover)",
          200: "var(--button-neutral-pressed)",
          300: "var(--button-inverted)",
          400: "var(--button-inverted-hover)",
          500: "var(--button-inverted-pressed)",
          600: "var(--button-danger)",
          700: "var(--button-danger-hover)",
          800: "var(--button-danger-pressed)",
          900: "var(--button-transparent)",
          950: "var(--button-transparent-hover)",
        },
        
        // Tag colors
        // Neutral tags
        stone: {
          50: "var(--tag-neutral-bg)",
          100: "var(--tag-neutral-bg-hover)",
          200: "var(--tag-neutral-text)",
          300: "var(--tag-neutral-border)",
          400: "var(--tag-neutral-icon)",
        },
        
        // Blue tags
        sky: {
          50: "var(--tag-blue-bg)",
          100: "var(--tag-blue-bg-hover)",
          200: "var(--tag-blue-text)",
          300: "var(--tag-blue-border)",
          400: "var(--tag-blue-icon)",
        },
        
        // Green tags
        green: {
          50: "var(--tag-green-bg)",
          100: "var(--tag-green-bg-hover)",
          200: "var(--tag-green-text)",
          300: "var(--tag-green-border)",
          400: "var(--tag-green-icon)",
        },
        
        // Red tags
        red: {
          50: "var(--tag-red-bg)",
          100: "var(--tag-red-bg-hover)",
          200: "var(--tag-red-text)",
          300: "var(--tag-red-border)",
          400: "var(--tag-red-icon)",
        },
        
        // Orange tags
        orange: {
          50: "var(--tag-orange-bg)",
          100: "var(--tag-orange-bg-hover)",
          200: "var(--tag-orange-text)",
          300: "var(--tag-orange-border)",
          400: "var(--tag-orange-icon)",
        },
        
        // Purple tags
        purple: {
          50: "var(--tag-purple-bg)",
          100: "var(--tag-purple-bg-hover)",
          200: "var(--tag-purple-text)",
          300: "var(--tag-purple-border)",
          400: "var(--tag-purple-icon)",
        },
        
        // Contrast colors
        amber: {
          50: "var(--contrast-bg-base)",
          100: "var(--contrast-bg-base-hover)",
          200: "var(--contrast-bg-base-pressed)",
          300: "var(--contrast-bg-subtle)",
          400: "var(--contrast-fg-primary)",
          500: "var(--contrast-fg-secondary)",
          600: "var(--contrast-border-base)",
          700: "var(--contrast-border-top)",
          800: "var(--contrast-border-bot)",
        },
        
        // Alpha colors
        transparent: {
          DEFAULT: "transparent",
          250: "var(--alpha-250)",
          400: "var(--alpha-400)",
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
