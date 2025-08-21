// @ts-check
import eslint from '@eslint/js'
import reactHooks from "eslint-plugin-react-hooks"
import tseslint from 'typescript-eslint'

export default tseslint.config(
	eslint.configs.recommended,
	tseslint.configs.recommended,
	reactHooks.configs[ 'recommended-latest' ],
	{
		languageOptions: {
			parserOptions: {
				projectService: { defaultProject: "./tsconfig.json" },
				tsconfigRootDir: import.meta.dirname,
			},
		},
		rules: {
			"react-hooks/react-compiler": "error",
		},
	}
)
