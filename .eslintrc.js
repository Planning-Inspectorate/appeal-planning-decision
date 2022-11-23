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
	plugins: ['jest'],
	root: true
};
