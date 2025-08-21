// @ts-check

import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'

export default tseslint.config(
	eslint.configs.recommended,
	tseslint.configs.recommended,
	{
		languageOptions: {
			parserOptions: {
				project: [ "./tsconfig.json" ],     // ton tsconfig du module
				tsconfigRootDir: import.meta.dirname, // <— équivalent moderne de __dirname
			},
		}
	}
)
