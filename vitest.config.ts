import path from 'path'

import { defineConfig } from 'vitest/config'

export default defineConfig({
	resolve: {
		alias: {
			'@david-urvoy/fire-engine': path.resolve(__dirname, 'src'),
		},
	},
	test: {
		exclude: ['**/node_modules/**', '**/dist/**'],
	},
})
