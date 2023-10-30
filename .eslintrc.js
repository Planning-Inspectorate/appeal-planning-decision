module.exports = {
	env: {
		es2021: true,
		jest: true,
		node: true
	},
	extends: ['eslint:recommended', 'prettier', 'plugin:cypress/recommended'],
	ignorePatterns: ['node_modules/**', 'dist/**', 'webpack.**', '*.bundle.js'],
	parserOptions: {
		ecmaVersion: 13,
		sourceType: 'module'
	},
	plugins: ['jest', 'enforce-catch-block-error-type-guards'],
	// rules: {
	// 	'enforce-catch-block-error-type-guards/enforce-catch-block-error-type-guards': 'error'
	// },
	root: true
};
