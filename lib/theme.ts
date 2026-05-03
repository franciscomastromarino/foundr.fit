import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react'

const config = defineConfig({
  theme: {
    tokens: {
      fonts: {
        heading: { value: 'var(--font-inter), sans-serif' },
        body: { value: 'var(--font-inter), sans-serif' },
      },
      colors: {
        // Primary — deep purple/indigo from design system
        brand: {
          50: { value: '#F0EDFF' },
          100: { value: '#D9D2FF' },
          200: { value: '#B3A5FF' },
          300: { value: '#8D78FF' },
          400: { value: '#674BFF' },
          500: { value: '#4318FF' },
          600: { value: '#3614CC' },
          700: { value: '#290F99' },
          800: { value: '#1B0B66' },
          900: { value: '#0E0633' },
          950: { value: '#07031A' },
        },
        // Accent — orange/coral
        accent: {
          50: { value: '#FFF3ED' },
          100: { value: '#FFE0CC' },
          200: { value: '#FFC199' },
          300: { value: '#FFA366' },
          400: { value: '#FF8533' },
          500: { value: '#FF6B2C' },
          600: { value: '#E55A1B' },
          700: { value: '#B24515' },
          800: { value: '#7F310F' },
          900: { value: '#4C1D09' },
          950: { value: '#260F05' },
        },
        // Dark-mode surface colors
        surface: {
          bg: { value: '#0B0D1A' },
          card: { value: '#141726' },
          elevated: { value: '#1A1D35' },
          border: { value: 'rgba(255, 255, 255, 0.08)' },
          input: { value: '#1A1D35' },
        },
      },
    },
    semanticTokens: {
      colors: {
        brand: {
          contrast: { value: 'white' },
          fg: { value: '{colors.brand.300}' },
          subtle: { value: '{colors.brand.900}' },
          muted: { value: '{colors.brand.800}' },
          emphasized: { value: '{colors.brand.700}' },
          solid: { value: '{colors.brand.600}' },
          focusRing: { value: '{colors.brand.500}' },
          border: { value: '{colors.brand.400}' },
        },
        accent: {
          contrast: { value: 'white' },
          fg: { value: '{colors.accent.300}' },
          subtle: { value: '{colors.accent.900}' },
          muted: { value: '{colors.accent.800}' },
          emphasized: { value: '{colors.accent.700}' },
          solid: { value: '{colors.accent.600}' },
          focusRing: { value: '{colors.accent.500}' },
          border: { value: '{colors.accent.400}' },
        },
        bg: {
          DEFAULT: { value: '{colors.surface.bg}' },
          muted: { value: '{colors.surface.card}' },
          subtle: { value: '{colors.surface.elevated}' },
        },
        fg: {
          DEFAULT: { value: 'white' },
          muted: { value: '#8B8FA3' },
          subtle: { value: '#6B6F83' },
        },
        border: {
          DEFAULT: { value: '{colors.surface.border}' },
        },
      },
    },
  },
  globalCss: {
    'html, body': {
      fontFamily: 'var(--font-inter), sans-serif',
      bg: '{colors.surface.bg}',
      color: 'white',
      colorScheme: 'dark',
    },
  },
})

export const system = createSystem(defaultConfig, config)
