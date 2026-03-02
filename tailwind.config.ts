import type { Config } from "tailwindcss";

// BusBook Brand Colors - defined directly in config to avoid module resolution issues
const colors = {
  // === LANDING PAGE: Rajasthan-Inspired Palette ===
  saffron: {
    DEFAULT: '#FF6B35',
    light: '#FF8C5A',
    dark: '#E54F1A',
  },
  royalBlue: {
    DEFAULT: '#004E89',
    light: '#0066B3',
    dark: '#003660',
  },
  deepPurple: {
    DEFAULT: '#6A1B4D',
    light: '#8B2468',
    dark: '#4D1237',
  },
  warmBeige: {
    DEFAULT: '#F7F4EA',
    light: '#FDFCF8',
    dark: '#EDE8D4',
  },
  goldAccent: {
    DEFAULT: '#D4AF37',
    light: '#E8CC6E',
    dark: '#B8941E',
  },
  forestGreen: {
    DEFAULT: '#2D5016',
    light: '#3D6B1E',
    dark: '#1E3610',
  },
  terracotta: {
    DEFAULT: '#C1666B',
    light: '#D4878B',
    dark: '#A84449',
  },

  // === APP UI Colors (kept for backward compatibility) ===
  primary: {
    DEFAULT: '#0F172A',
    light: '#1E293B',
    dark: '#020617',
  },
  accent: {
    DEFAULT: '#F97316',
    light: '#FB923C',
    dark: '#EA580C',
  },
  gold: {
    DEFAULT: '#EAB308',
    light: '#FACC15',
    dark: '#CA8A04',
  },
  neutral: {
    50: '#F8FAFC',
    100: '#F1F5F9',
    200: '#E2E8F0',
    300: '#CBD5E1',
    400: '#94A3B8',
    500: '#64748B',
    600: '#475569',
    700: '#334155',
    800: '#1E293B',
    900: '#0F172A',
  },
  success: {
    DEFAULT: '#28A745',
    light: '#4CBB63',
    dark: '#1E7E34',
  },
  warning: {
    DEFAULT: '#FFC107',
    light: '#FFD54F',
    dark: '#F57C00',
  },
  error: {
    DEFAULT: '#DC3545',
    light: '#E57373',
    dark: '#C62828',
  },
  info: {
    DEFAULT: '#17A2B8',
    light: '#4DD5EC',
    dark: '#117A8B',
  },
};

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Landing Page Brand Colors
        saffron: colors.saffron,
        royalBlue: colors.royalBlue,
        deepPurple: colors.deepPurple,
        warmBeige: colors.warmBeige,
        goldAccent: colors.goldAccent,
        forestGreen: colors.forestGreen,
        terracotta: colors.terracotta,

        // App UI Colors (backward compat)
        primary: colors.primary,
        accent: colors.accent,
        gold: colors.gold,
        neutral: colors.neutral,
        success: colors.success,
        warning: colors.warning,
        error: colors.error,
        info: colors.info,
        
        // Shadcn UI compatibility colors
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
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
      
      // Typography Scale
      fontSize: {
        'h1': ['32px', { lineHeight: '1.2', fontWeight: '700' }],
        'h2': ['24px', { lineHeight: '1.3', fontWeight: '600' }],
        'h3': ['20px', { lineHeight: '1.4', fontWeight: '600' }],
        'h4': ['18px', { lineHeight: '1.4', fontWeight: '600' }],
        'body': ['16px', { lineHeight: '1.6', fontWeight: '400' }],
        'small': ['14px', { lineHeight: '1.5', fontWeight: '400' }],
        'xs': ['12px', { lineHeight: '1.5', fontWeight: '400' }],
      },
      
      // Spacing Scale (8px grid)
      spacing: {
        'xs': '4px',
        'sm': '8px',
        'md': '16px',
        'lg': '24px',
        'xl': '32px',
        '2xl': '48px',
        '3xl': '64px',
        '4xl': '96px',
      },
      
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        display: ['var(--font-poppins)', 'var(--font-outfit)', 'sans-serif'],
        hindi: ['var(--font-devanagari)', 'sans-serif'],
      },
      keyframes: {
        'bounce-subtle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'count-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-whatsapp': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(37, 211, 102, 0.5)' },
          '50%': { boxShadow: '0 0 0 12px rgba(37, 211, 102, 0)' },
        },
        'slide-in-right': {
          '0%': { opacity: '0', transform: 'translateX(24px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
      animation: {
        'bounce-subtle': 'bounce-subtle 2s ease-in-out infinite',
        'fade-in-up': 'fade-in-up 0.6s ease-out forwards',
        'fade-in': 'fade-in 0.4s ease-out forwards',
        'count-up': 'count-up 0.5s ease-out forwards',
        'pulse-whatsapp': 'pulse-whatsapp 3s ease-in-out infinite',
        'slide-in-right': 'slide-in-right 0.5s ease-out forwards',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;