import { defineConfig, globalIgnores } from 'eslint/config';
import { eslintConfig } from '@planning-inspectorate/coding-standards';
import jest from 'eslint-plugin-jest';
import cypress from 'eslint-plugin-cypress';
import globals from 'globals';

export default defineConfig([
	...eslintConfig,
	globalIgnores(['public/**', 'dist/**', 'webpack.**', '*.bundle.js', 'test-packages/**/*.js']),
	{
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
	{
		files: ['packages/forms-web-app/src/lib/client-side/**/*.js'],
		languageOptions: {
			globals: {
				...globals.browser
			}
		}
	},
	{
		files: [
			'**/*.test.js',
			'**/*.spec.js',
			'**/__mocks__/**/*.js',
			'**/__tests__/**/*.js',
			'packages/document-service-api/test/utils/mocks.js',
			'packages/pdf-service-api/test/utils/mocks.js'
		],
		languageOptions: {
			globals: {
				...globals.node,
				...globals.jest
			}
		},
		plugins: {
			jest
		}
	},
	{
		files: ['test-packages/**/*.js'],
		extends: [cypress.configs.recommended],
		rules: {
			'check-file/folder-naming-convention': 'off',
			'check-file/filename-naming-convention': 'off'
		}
	},
	{
		files: ['**/*.d.ts'],
		rules: {
			// allow imports for types in d.ts files
			'@typescript-eslint/consistent-type-imports': 'off',
			// allow 'renaming' types with an empty extends
			'@typescript-eslint/no-empty-object-type': 'off',
			// these are type definition files
			'no-unused-vars': 'off'
		}
	},
	{
		files: [
			// allow these special folder names
			'**/__{mocks,tests}__/**/*.{ts,js}',
			// allow route folders starting _
			'packages/appeals-service-api/src/routes/v2/**/_*/**/*.{ts,js}',
			'packages/common/src/router/v2/**/_*/**/*.{ts,js}',
			'packages/document-service-api/src/routes/v2/**/_*/**/*.{ts,js}',
			'packages/forms-web-app/src/routes/file-based-router/**/_*/**/*.{ts,js}'
		],
		rules: {
			'check-file/folder-naming-convention': 'off'
		}
	},
	{
		files: [
			// allow existing camelCase or non-compliant files names
			'dev/mock-notify/middlewares/add_type.js',
			'packages/appeals-service-api/__tests__/developer/**/*.js',
			'packages/appeals-service-api/__tests__/routerMock.js',
			'packages/appeals-service-api/src/configuration/featureFlag.js',
			'packages/appeals-service-api/src/errors/apiError.js',
			'packages/appeals-service-api/src/errors/apiErrorHandler.js',
			'packages/auth-server/__tests__/globalSetup.js',
			'packages/auth-server/__tests__/globalTeardown.js',
			'packages/auth-server/src/configuration/featureFlag.js',
			'packages/business-rules/src/schemas/components/uploadedFileValidation.js',
			'packages/business-rules/src/schemas/householder-appeal/appeal-schema/sections/about-you/aboutYouValidation.js',
			'packages/common/schema/documentMetadata.js',
			'packages/common/setupTests.js',
			'packages/common/src/blobStorage.js',
			'packages/common/src/lib/flattenObjectToDotNotation.js',
			'packages/common/src/lib/getAzureBlobPathFromUri.js',
			'packages/document-service-api/src/configuration/featureFlag.js',
			'packages/document-service-api/src/lib/addFileMetadata.js',
			'packages/document-service-api/src/lib/blobStorage.js',
			'packages/document-service-api/src/lib/deleteLocalFile.js',
			'packages/document-service-api/src/lib/uploadLocalFile.js',
			'packages/document-service-api/src/schemas/documentsMethods.js',
			'packages/document-service-api/test/developer/globalSetup.js',
			'packages/document-service-api/test/developer/globalTeardown.js',
			'packages/forms-web-app/src/featureFlag.js',
			'packages/forms-web-app/__tests__/setupTests.js',
			'packages/pdf-service-api/src/lib/generatePdf.js'
		],
		rules: {
			'check-file/filename-naming-convention': 'off'
		}
	}
]);
