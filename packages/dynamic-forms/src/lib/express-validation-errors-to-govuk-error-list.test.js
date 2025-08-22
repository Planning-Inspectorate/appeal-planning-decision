const {
	expressValidationErrorsToGovUkErrorList
} = require('./express-validation-errors-to-govuk-error-list');

describe('lib/express-validation-errors-to-govuk-error-list', () => {
	[
		{
			description: 'no errors',
			given: {},
			expected: []
		},
		{
			description: 'one error',
			given: {
				'a-form-field-key': {
					value: undefined,
					msg: 'You need to select a response',
					param: 'a-form-field-key',
					location: 'body'
				}
			},
			expected: [
				{
					text: 'You need to select a response',
					href: '#a-form-field-key'
				}
			]
		},
		{
			description: 'multiple errors',
			given: {
				'a-form-field-key': {
					value: undefined,
					msg: 'You need to select a response',
					param: 'a-form-field-key',
					location: 'body'
				},
				'another-form-field-key': {
					value: 7,
					msg: 'Value should be a string',
					param: 'another-form-field-key',
					location: 'body'
				}
			},
			expected: [
				{
					text: 'You need to select a response',
					href: '#a-form-field-key'
				},
				{
					text: 'Value should be a string',
					href: '#another-form-field-key'
				}
			]
		}
	].forEach(({ description, given, expected }) => {
		it(`should map the given express validation errors to the Gov UK error list format: - ${description}`, () => {
			expect(expressValidationErrorsToGovUkErrorList(given)).toEqual(expected);
		});
	});
});
