/**
 * Optional Tailwind integration for PWF tokens.
 * Applications retain control of their own content paths and plugins.
 */
module.exports = {
  darkMode: ['selector', '[data-pwf-color-scheme="dark"]'],
  theme: {
    extend: {
      colors: {
        pwf: {
          accent: 'var(--pwf-color-accent)',
          'accent-hover': 'var(--pwf-color-accent-hover)',
          canvas: 'var(--pwf-color-canvas)',
          surface: 'var(--pwf-color-surface)',
          text: 'var(--pwf-color-text)',
          muted: 'var(--pwf-color-text-muted)',
          border: 'var(--pwf-color-border)'
        }
      },
      borderRadius: {
        'pwf-sm': 'var(--pwf-radius-sm)',
        pwf: 'var(--pwf-radius-md)',
        'pwf-lg': 'var(--pwf-radius-lg)'
      },
      boxShadow: {
        pwf: 'var(--pwf-shadow-md)'
      },
      maxWidth: {
        'pwf-normal': 'var(--pwf-layout-normal)',
        'pwf-wide': 'var(--pwf-layout-wide)'
      },
      transitionDuration: {
        pwf: 'var(--pwf-duration-normal)'
      }
    }
  }
};
