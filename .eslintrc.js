module.exports = {
	env: {
		es2021: true,
		jest: true,
		node: true
	},
	extends: ['eslint:recommended', 'prettier'],
	ignorePatterns: ['node_modules/**', 'dist/**', 'webpack.**', '*.bundle.js'],
	parserOptions: {
		ecmaVersion: 2020,
		sourceType: 'module'
	},
	plugins: ['jest'],
	root: true
};
