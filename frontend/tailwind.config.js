/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#8B2635',
          hover: '#6B1E2A',
          active: '#5A1822',
          light: '#FDF2F2'
        },
        dark: {
          DEFAULT: '#1A1A1A',
          elevated: '#2D2D2D'
        },
        gray: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          700: '#374151',
          900: '#111827'
        },
        success: '#059669',
        warning: '#D97706',
        danger: '#EF4444',
        // Info only for rare system messages, prefer maroon
        info: '#3B82F6'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif']
      },
      fontSize: {
        'display-xl': ['48px', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '700' }],
        'heading-lg': ['36px', { lineHeight: '1.2', fontWeight: '700' }],
        'heading-md': ['28px', { lineHeight: '1.25', fontWeight: '700' }],
        'heading-sm': ['20px', { lineHeight: '1.3', fontWeight: '600' }],
        'body-lg': ['18px', { lineHeight: '1.6' }],
        'body-md': ['16px', { lineHeight: '1.6' }],
        'body-sm': ['14px', { lineHeight: '1.5' }],
        'caption': ['12px', { lineHeight: '1.4', fontWeight: '500' }]
      },
      borderRadius: {
        sm: '6px',
        md: '8px',
        lg: '12px',
        xl: '16px'
      },
      boxShadow: {
        sm: '0 1px 2px rgba(0,0,0,0.05)',
        md: '0 4px 6px -1px rgba(0,0,0,0.1)',
        lg: '0 10px 15px -3px rgba(0,0,0,0.1)',
        xl: '0 20px 25px -5px rgba(0,0,0,0.1)'
      },
      keyframes: {
        fiber: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' }
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        gradientX: {
          '0%, 100%': { backgroundSize: '200% 200%', backgroundPosition: 'left center' },
          '50%': { backgroundSize: '200% 200%', backgroundPosition: 'right center' }
        }
      },
      animation: {
        fiber: 'fiber linear infinite',
        'fade-in-up': 'fadeInUp 0.8s ease-out both',
        'gradient-x': 'gradientX 3s ease infinite'
      }
    }
  },
  plugins: []
}
