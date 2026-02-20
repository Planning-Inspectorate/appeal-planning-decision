const { defineConfig, globalIgnores } = require('eslint/config');

const globals = require('globals');
const jest = require('eslint-plugin-jest');
const enforceCatchBlockErrorTypeGuards = require('eslint-plugin-enforce-catch-block-error-type-guards');
const js = require('@eslint/js');

const { FlatCompat } = require('@eslint/eslintrc');

const compat = new FlatCompat({
	baseDirectory: __dirname,
	recommendedConfig: js.configs.recommended,
	allConfig: js.configs.all
});

module.exports = defineConfig([
	{
		languageOptions: {
			globals: {
				...globals.jest,
				...globals.node
			},

			ecmaVersion: 13,
			sourceType: 'module',
			parserOptions: {}
		},

		extends: compat.extends('eslint:recommended', 'prettier', 'plugin:cypress/recommended'),

		plugins: {
			jest,
			'enforce-catch-block-error-type-guards': enforceCatchBlockErrorTypeGuards
		},

		rules: {
			'no-unused-vars': [
				'error',
				{
					vars: 'all',
					varsIgnorePattern: '^_',
					args: 'after-used',
					argsIgnorePattern: '^_',
					ignoreRestSiblings: false
				}
			]
		}
	},
	globalIgnores(['node_modules/**/*', 'dist/**/*', '**/webpack.**', '**/*.bundle.js']),
	globalIgnores(['**/public/', '**/dist/'])
]);
