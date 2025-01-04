import type { Config } from 'tailwindcss'

export default {
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			fontFamily: {
				bebas: ['Bebas Neue', 'cursive'],
			},
		},
	},
	plugins: [],
} satisfies Config
