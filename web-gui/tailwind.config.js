/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                studio: "hsl(var(--studio-bg))",
                sidebar: "hsl(var(--sidebar-bg))",
                panel: "hsl(var(--panel-bg))",
                border: "hsl(var(--border))",
                accent: {
                    DEFAULT: "hsl(var(--accent))",
                    foreground: "hsl(var(--accent-foreground))",
                },
                foreground: {
                    DEFAULT: "hsl(var(--foreground))",
                    muted: "hsl(var(--foreground-muted))",
                },
            },
        },
    },
    plugins: [],
}