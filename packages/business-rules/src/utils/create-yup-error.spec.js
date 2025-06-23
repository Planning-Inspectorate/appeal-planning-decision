const createYupError = require('./create-yup-error');

describe('utils/create-yup-error', () => {
	it('should be called with the correct params', () => {
		const errorMessage = 'must not be in the past';
		const context = {
			createError: jest.fn(),
			path: 'decisionDate'
		};

		createYupError.call(context, errorMessage);

		expect(context.createError).toHaveBeenCalledTimes(1);
		expect(context.createError).toHaveBeenCalledWith({
			path: context.path,
			message: `${context.path} ${errorMessage}`
		});
	});
});
