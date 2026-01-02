import type { Config } from 'tailwindcss';

/**
 * Vortex Protocol 2026 Design System
 * Dark mode default + Glassmorphism + Neumorphism
 */

const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Base Network Colors (2026)
        base: {
          50: '#4F8AFF',
          100: '#4F8AFF',
          200: '#4F8AFF',
          300: '#4F8AFF',
          400: '#4F8AFF',
          500: '#0052FF', // Primary
          600: '#0038B7', // Dark
          700: '#002E94',
          800: '#002474',
          900: '#001A54',
          950: '#001038',
        },
        
        // Category Colors (Risk Transparency)
        category: {
          premium: '#10B981',
          dust: '#F59E0B',
          micro: '#6B7280',
          risk: '#EF4444',
        },
        
        // Glassmorphism Colors
        glass: {
          bg: 'rgba(255, 255, 255, 0.05)',
          border: 'rgba(255, 255, 255, 0.12)',
          light: 'rgba(255, 255, 255, 0.1)',
        },
        
        // Dark Mode Backgrounds
        bg: {
          primary: '#0A0E1A', // Deep space black
          secondary: '#111627', // Slate dark
          tertiary: '#1A1F36', // Slate darker
        },
        
        // Text Colors (Dark Mode)
        text: {
          primary: '#F8FAFC', // White
          secondary: '#94A3B8', // Slate light
          muted: '#64748B', // Slate muted
        },
        
        // Legacy colors for compatibility
        sky: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },
        
        // Neutrals (Dark Mode)
        neutral: {
          0: '#0A0E1A',
          50: '#111627',
          100: '#1A1F36',
          150: '#252B3F',
          200: '#2E3550',
          300: '#3B4256',
          400: '#6B7280',
          500: '#94A3B8',
          600: '#CBD5E1',
          700: '#E2E8F0',
          800: '#F1F5F9',
          900: '#F8FAFC',
          950: '#FFFFFF',
        },
        
        // Semantic colors
        success: '#10B981',
        warning: '#F59E0B',
        danger: '#EF4444',
        info: '#3b82f6',
      },
      
      fontFamily: {
        display: ['Inter', '-apple-system', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        body: ['Inter', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'sans-serif'],
        mono: ['JetBrains Mono', '"Roboto Mono"', 'monospace'],
      },
      
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.875rem' }],
        display: ['4rem', { lineHeight: '4.5rem' }], // 64px / 72px
        hero: ['3rem', { lineHeight: '3.5rem' }], // 48px / 56px
      },
      
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '112': '28rem',
        '128': '32rem',
      },
      
      borderRadius: {
        '4xl': '2rem',
        'glass': '20px',
        'neumo': '16px',
      },
      
      boxShadow: {
        // Neumorphic shadows
        'neumo': '8px 8px 16px rgba(0,82,255,0.3), -8px -8px 16px rgba(255,255,255,0.1)',
        'neumo-inset': 'inset 8px 8px 16px rgba(0,0,0,0.3), inset -8px -8px 16px rgba(255,255,255,0.1)',
        'neumo-primary': '8px 8px 16px rgba(0,82,255,0.3), -8px -8px 16px rgba(255,255,255,0.1)',
        
        // Glassmorphism shadows
        'glass': '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
        'glass-lg': '0 20px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)',
        
        // Category glows
        'premium': '0 4px 12px rgba(16, 185, 129, 0.4)',
        'risk': '0 4px 12px rgba(239, 68, 68, 0.6)',
        'dust': '0 4px 12px rgba(245, 158, 11, 0.4)',
        
        // Base glow
        'glow': '0 0 5px #0052FF',
        'glow-md': '0 0 20px #0052FF, 0 0 40px #0052FF',
        'glow-lg': '0 0 30px #0052FF, 0 0 60px #0052FF',
        
        // Legacy
        'glow-sm': '0 0 10px rgba(14, 165, 233, 0.1)',
      },
      
      animation: {
        'fade-in': 'fade-in 0.3s ease-out',
        'float': 'float 6s ease-in-out infinite',
        'slide-up': 'slide-up 0.3s ease-out',
        'slide-down': 'slide-down 0.3s ease-out',
        'scale-in': 'scale-in 0.2s ease-out',
        'pulse-soft': 'pulse-soft 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s infinite',
        'spin': 'spin 1s linear infinite',
        
        // 2026 animations
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'sweep': 'sweep 1.5s ease-in-out infinite',
        'bounce-in': 'bounce-in 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'stagger': 'stagger 0.5s ease-out',
      },
      
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-down': {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        'spin': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        
        // 2026 keyframes
        'glow': {
          '0%': { boxShadow: '0 0 5px #0052FF' },
          '100%': { boxShadow: '0 0 20px #0052FF, 0 0 40px #0052FF' },
        },
        'sweep': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        'bounce-in': {
          '0%': { transform: 'scale(0.8) rotate(-10deg)', opacity: '0' },
          '50%': { transform: 'scale(1.1) rotate(5deg)', opacity: '1' },
          '100%': { transform: 'scale(1) rotate(0deg)', opacity: '1' },
        },
        'stagger': {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        
        // 2026 gradients
        'gradient-premium': 'linear-gradient(135deg, #10B981, #059669)',
        'gradient-risk': 'linear-gradient(135deg, #EF4444, #DC2626)',
        'gradient-dust': 'linear-gradient(135deg, #F59E0B, #D97706)',
        'gradient-micro': 'linear-gradient(135deg, #6B7280, #4B5563)',
        'gradient-bg': 'linear-gradient(135deg, #0A0E1A, #111827)',
        'gradient-sweep': 'linear-gradient(90deg, #0052FF, #4F8AFF, #0038B7, #0052FF)',
      },
      
      backdropBlur: {
        xs: '2px',
        glass: '20px',
      },
    },
  },
  plugins: [],
};

export default config;
