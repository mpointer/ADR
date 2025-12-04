export const THEMES = {
    DEFAULT: {
        id: 'default',
        name: 'Default (Tech)',
        colors: {
            primary: 'cyan',
            secondary: 'slate',
            accent: 'emerald',
            bg: 'gray'
        },
        font: 'font-sans',
        radius: 'rounded-lg'
    },
    HEALTHCARE: {
        id: 'healthcare',
        name: 'Healthcare',
        colors: {
            primary: 'teal',
            secondary: 'slate',
            accent: 'emerald',
            bg: 'slate'
        },
        font: 'font-sans',
        radius: 'rounded-2xl' // Soft, friendly
    },
    FINANCE: {
        id: 'finance',
        name: 'Finance',
        colors: {
            primary: 'indigo',
            secondary: 'gray',
            accent: 'amber',
            bg: 'gray'
        },
        font: 'font-mono',
        radius: 'rounded-none' // Sharp, precise
    },
    RETAIL: {
        id: 'retail',
        name: 'Retail',
        colors: {
            primary: 'rose',
            secondary: 'stone',
            accent: 'orange',
            bg: 'stone'
        },
        font: 'font-sans font-bold', // Bold, energetic
        radius: 'rounded-xl'
    }
};

export const applyTheme = (theme) => {
    // This function could set CSS variables if we were using them.
    // For now, we might just return the class names to use.
    // Or we can set a data attribute on the body.
    document.documentElement.setAttribute('data-theme', theme.id);
};
