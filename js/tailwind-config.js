// Tailwind (CDN) theme. Every value comes from css/tokens.css — change tokens there, not here.
tailwind.config = {
  theme: {
    extend: {
      colors: {
        lovett: 'rgb(var(--color-lovett) / <alpha-value>)',
        'lovett-blue': 'rgb(var(--color-lovett-blue) / <alpha-value>)',
        charcoal: {
          DEFAULT: 'rgb(var(--color-charcoal) / <alpha-value>)',
          deep: 'rgb(var(--color-charcoal-deep) / <alpha-value>)',
        },
        copper: {
          DEFAULT: 'rgb(var(--color-copper) / <alpha-value>)',
          lt: 'rgb(var(--color-copper-lt) / <alpha-value>)',
        },
        ink: 'rgb(var(--color-ink) / <alpha-value>)',
        muted: 'rgb(var(--color-muted) / <alpha-value>)',
        stone: 'rgb(var(--color-stone) / <alpha-value>)',
        cream: 'rgb(var(--color-cream) / <alpha-value>)',
        line: 'rgb(var(--color-line) / <alpha-value>)',
      },
      fontFamily: {
        sans: ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
      },
      // tracking-eyebrow (eyebrows) · tracking-label (small labels)
      letterSpacing: {
        eyebrow: 'var(--ls-eyebrow)',
        label: 'var(--ls-label)',
      },
    },
  },
};
