/**
 * Vortex Protocol - Premium Design Tokens
 * Inspired by Linear, Stripe, and Base
 */

export const tokens = {
  // ==================== COLORS ====================
  color: {
    // Premium Blue (Trust + Premium)
    primary: {
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
    
    // Warm Neutral (Professional + Friendly)
    neutral: {
      0: '#ffffff',
      50: '#fafaf8',
      100: '#f5f5f2',
      150: '#efefeb',
      200: '#e7e5e1',
      300: '#d6d3ce',
      400: '#a8a29e',
      500: '#78716c',
      600: '#57534e',
      700: '#44403c',
      800: '#292524',
      900: '#1c1917',
      950: '#0c0a09',
    },
    
    // Semantic
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
    info: '#3b82f6',
    
    // Glass effects
    glass: {
      light: 'rgba(255, 255, 255, 0.85)',
      ultralight: 'rgba(255, 255, 255, 0.6)',
    },
    border: {
      light: 'rgba(0, 0, 0, 0.08)',
      medium: 'rgba(0, 0, 0, 0.12)',
      dark: 'rgba(0, 0, 0, 0.2)',
    },
  },

  // ==================== TYPOGRAPHY ====================
  font: {
    family: {
      display: '-apple-system, "SF Pro Display", "Inter", sans-serif',
      body: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      mono: '"Fira Code", "JetBrains Mono", monospace',
    },
    size: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
      '6xl': '3.75rem',
      '7xl': '4.5rem',
    },
    weight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
    },
    lineHeight: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.75,
    },
  },

  // ==================== SPACING ====================
  space: {
    0: '0',
    0.5: '0.125rem',
    1: '0.25rem',
    1.5: '0.375rem',
    2: '0.5rem',
    3: '0.75rem',
    4: '1rem',
    5: '1.25rem',
    6: '1.5rem',
    8: '2rem',
    10: '2.5rem',
    12: '3rem',
    16: '4rem',
    20: '5rem',
    24: '6rem',
    32: '8rem',
  },

  // ==================== RADIUS ====================
  radius: {
    none: '0',
    xs: '0.375rem',
    sm: '0.5rem',
    md: '0.75rem',
    lg: '1rem',
    xl: '1.5rem',
    '2xl': '2rem',
    full: '9999px',
  },

  // ==================== SHADOWS ====================
  shadow: {
    none: 'none',
    xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    glow: '0 0 0 1px rgba(14, 165, 233, 0.3), 0 0 0 4px rgba(14, 165, 233, 0.1)',
    glass: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
  },

  // ==================== MOTION ====================
  motion: {
    duration: {
      instant: '0ms',
      fast: '100ms',
      normal: '150ms',
      slow: '250ms',
      slower: '400ms',
    },
    easing: {
      ease: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
      spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      out: 'cubic-bezier(0.16, 1, 0.3, 1)',
      in: 'cubic-bezier(0.6, 0, 0.84, 0)',
      bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    },
  },

  // ==================== BREAKPOINTS ====================
  breakpoint: {
    xs: '320px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
} as const;

export type Token = typeof tokens;

