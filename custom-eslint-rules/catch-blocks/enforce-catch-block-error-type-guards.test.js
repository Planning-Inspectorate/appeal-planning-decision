const { RuleTester } = require('eslint');
const catchBlockRule = require('./enforce-catch-block-error-type-guards');

const ruleTester = new RuleTester({
	parserOptions: { ecmaVersion: 2015 }
});

const getExpectedError = (output) => {
	return {
		message:
			'Catch block relies on calling error object with non standard properties without type guard',
		suggestions: [
			{
				desc: 'Try adding an if statement around these statements, within the body of the catch block',
				output
			}
		]
	};
};

ruleTester.run(
	'enforce-catch-block-error-type-guards', // rule name
	catchBlockRule, // rule code
	{
		// checks
		// 'valid' checks cases that should pass
		valid: [
			{
				code: 'try {} catch (error) { if(error instanceof ApiError) { logger.error(`Failed to get appeals: ${error.code}`); statusCode = error.code; body = error.message.errors; } }',
				errors: 0
			},
			{
				code: 'try {} catch (error) { if(!(error instanceof ApiError)) { throw error; } logger.error(`Failed to get appeals: ${error.code}`); statusCode = error.code; body = error.message.errors; }',
				errors: 0
			},
			{
				code: 'try {} catch (error) { logger.error(`Failed to get appeals`); statusCode = 500; body = `an error was found`; }',
				errors: 0
			}
		],
		// 'invalid' checks cases that should not pass
		invalid: [
			{
				code: 'try {} catch (error) { logger.error(`Failed to get appeals: ${error.code}`); statusCode = error.code; body = error.message.errors; }',
				output:
					'try {} catch (error) { logger.error(`Failed to get appeals: ${error.code}`); statusCode = error.code; body = error.message.errors; }',
				errors: [
					getExpectedError(
						'try {} catch (error) {if(error instanceof ApiError) { logger.error(`Failed to get appeals: ${error.code}`); statusCode = error.code; body = error.message.errors; }}'
					),
					getExpectedError(
						'try {} catch (error) {if(error instanceof ApiError) { logger.error(`Failed to get appeals: ${error.code}`); statusCode = error.code; body = error.message.errors; }}'
					)
				]
			},
			{
				code: 'try {} catch (error) { if(1 === 1) { statusCode = error.code; } }',
				output: 'try {} catch (error) { if(1 === 1) { statusCode = error.code; } }',
				errors: [
					getExpectedError(
						'try {} catch (error) {if(error instanceof ApiError) { if(1 === 1) { statusCode = error.code; } }}'
					)
				]
			}
		]
	}
);
