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
        // Medusa UI Color Variables
        // Background colors
        bg: {
          base: "var(--bg-base)",
          "base-hover": "var(--bg-base-hover)",
          "base-pressed": "var(--bg-base-pressed)",
          component: "var(--bg-component)",
          "component-hover": "var(--bg-component-hover)",
          "component-pressed": "var(--bg-component-pressed)",
          subtle: "var(--bg-subtle)",
          "subtle-hover": "var(--bg-subtle-hover)",
          "subtle-pressed": "var(--bg-subtle-pressed)",
          field: "var(--bg-field)",
          "field-hover": "var(--bg-field-hover)",
          "field-component": "var(--bg-field-component)",
          "field-component-hover": "var(--bg-field-component-hover)",
          interactive: "var(--bg-interactive)",
          highlight: "var(--bg-highlight)",
          "highlight-hover": "var(--bg-highlight-hover)",
          disabled: "var(--bg-disabled)",
          overlay: "var(--bg-overlay)",
          "switch-off": "var(--bg-switch-off)",
          "switch-off-hover": "var(--bg-switch-off-hover)",
        },
        
        // Foreground colors
        fg: {
          base: "var(--fg-base)",
          subtle: "var(--fg-subtle)",
          muted: "var(--fg-muted)",
          disabled: "var(--fg-disabled)",
          "on-color": "var(--fg-on-color)",
          "on-inverted": "var(--fg-on-inverted)",
          interactive: "var(--fg-interactive)",
          "interactive-hover": "var(--fg-interactive-hover)",
          error: "var(--fg-error)",
        },
        
        // Border colors
        border: {
          base: "var(--border-base)",
          strong: "var(--border-strong)",
          interactive: "var(--border-interactive)",
          error: "var(--border-error)",
          danger: "var(--border-danger)",
          transparent: "var(--border-transparent)",
          "menu-top": "var(--border-menu-top)",
          "menu-bot": "var(--border-menu-bot)",
        },
        
        // Button colors
        button: {
          neutral: "var(--button-neutral)",
          "neutral-hover": "var(--button-neutral-hover)",
          "neutral-pressed": "var(--button-neutral-pressed)",
          inverted: "var(--button-inverted)",
          "inverted-hover": "var(--button-inverted-hover)",
          "inverted-pressed": "var(--button-inverted-pressed)",
          danger: "var(--button-danger)",
          "danger-hover": "var(--button-danger-hover)",
          "danger-pressed": "var(--button-danger-pressed)",
          transparent: "var(--button-transparent)",
          "transparent-hover": "var(--button-transparent-hover)",
          "transparent-pressed": "var(--button-transparent-pressed)",
        },
        
        // Tag colors
        tag: {
          // Neutral tags
          "neutral-bg": "var(--tag-neutral-bg)",
          "neutral-bg-hover": "var(--tag-neutral-bg-hover)",
          "neutral-text": "var(--tag-neutral-text)",
          "neutral-border": "var(--tag-neutral-border)",
          "neutral-icon": "var(--tag-neutral-icon)",
          
          // Blue tags
          "blue-bg": "var(--tag-blue-bg)",
          "blue-bg-hover": "var(--tag-blue-bg-hover)",
          "blue-text": "var(--tag-blue-text)",
          "blue-border": "var(--tag-blue-border)",
          "blue-icon": "var(--tag-blue-icon)",
          
          // Green tags
          "green-bg": "var(--tag-green-bg)",
          "green-bg-hover": "var(--tag-green-bg-hover)",
          "green-text": "var(--tag-green-text)",
          "green-border": "var(--tag-green-border)",
          "green-icon": "var(--tag-green-icon)",
          
          // Red tags
          "red-bg": "var(--tag-red-bg)",
          "red-bg-hover": "var(--tag-red-bg-hover)",
          "red-text": "var(--tag-red-text)",
          "red-border": "var(--tag-red-border)",
          "red-icon": "var(--tag-red-icon)",
          
          // Orange tags
          "orange-bg": "var(--tag-orange-bg)",
          "orange-bg-hover": "var(--tag-orange-bg-hover)",
          "orange-text": "var(--tag-orange-text)",
          "orange-border": "var(--tag-orange-border)",
          "orange-icon": "var(--tag-orange-icon)",
          
          // Purple tags
          "purple-bg": "var(--tag-purple-bg)",
          "purple-bg-hover": "var(--tag-purple-bg-hover)",
          "purple-text": "var(--tag-purple-text)",
          "purple-border": "var(--tag-purple-border)",
          "purple-icon": "var(--tag-purple-icon)",
        },
        
        // Contrast colors
        contrast: {
          "bg-base": "var(--contrast-bg-base)",
          "bg-base-hover": "var(--contrast-bg-base-hover)",
          "bg-base-pressed": "var(--contrast-bg-base-pressed)",
          "bg-subtle": "var(--contrast-bg-subtle)",
          "fg-primary": "var(--contrast-fg-primary)",
          "fg-secondary": "var(--contrast-fg-secondary)",
          "border-base": "var(--contrast-border-base)",
          "border-top": "var(--contrast-border-top)",
          "border-bot": "var(--contrast-border-bot)",
        },
        
        // Alpha colors
        alpha: {
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
