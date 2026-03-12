const WordValidator = require('./word-validator');

describe('src/dynamic-forms/validator/word-validator.js', () => {
	it('should throw if nothing passed to constructor', () => {
		// eslint-disable-next-line no-unused-vars
		expect(() => {
			new WordValidator();
		}).toThrow('Word validator is invoked without any validations set!');
	});
	it('should invalidate a string that is too short', async () => {
		const req = {
			body: {
				shortStatement: 'I am too short'
			}
		};
		const options = {
			minLength: {
				minLength: 5,
				minLengthMessage: 'Short statement should be a minimum of 5 words in length'
			}
		};
		const question = {
			fieldName: 'shortStatement'
		};
		const validationResult = await new WordValidator(options).validate(question).run(req);
		expect(validationResult.errors.length).toEqual(1);
		expect(validationResult.errors[0].msg).toEqual(options.minLength.minLengthMessage);
	});
	it('should invalidate a string that is too short and use the default error message when none supplied', async () => {
		const req = {
			body: {
				shortStatement: 'I am too short'
			}
		};
		const options = {
			minLength: {
				minLength: 5
			}
		};
		const question = {
			fieldName: 'shortStatement'
		};
		const validationResult = await new WordValidator(options).validate(question).run(req);
		expect(validationResult.errors.length).toEqual(1);
		expect(validationResult.errors[0].msg).toEqual(
			'Input too short - Please enter at least 5 words'
		);
	});
	it('should validate a string that is long enough', async () => {
		const req = {
			body: {
				shortStatement: 'I am long enough'
			}
		};
		const options = {
			minLength: {
				minLength: 3
			}
		};
		const question = {
			fieldName: 'shortStatement'
		};
		const validationResult = await new WordValidator(options).validate(question).run(req);
		expect(validationResult.errors.length).toEqual(0);
	});
	it('should invalidate a string that is too long', async () => {
		const req = {
			body: {
				shortStatement: 'I am too long'
			}
		};
		const options = {
			maxLength: {
				maxLength: 3,
				maxLengthMessage: 'Short statement should be a maxmimum of 3 characters in length'
			}
		};
		const question = {
			fieldName: 'shortStatement'
		};
		const validationResult = await new WordValidator(options).validate(question).run(req);
		expect(validationResult.errors.length).toEqual(1);
		expect(validationResult.errors[0].msg).toEqual(options.maxLength.maxLengthMessage);
	});
	it('should invalidate a string that is too long and use the default error message when none supplied', async () => {
		const req = {
			body: {
				shortStatement: 'I am too long'
			}
		};
		const options = {
			maxLength: {
				maxLength: 3
			}
		};
		const question = {
			fieldName: 'shortStatement'
		};
		const validationResult = await new WordValidator(options).validate(question).run(req);
		expect(validationResult.errors.length).toEqual(1);
		expect(validationResult.errors[0].msg).toEqual(
			'Input too long - Please enter no more than 3 words'
		);
	});

	it('should validate a string that is not too long', async () => {
		const req = {
			body: {
				shortStatement: 'I am not too long'
			}
		};
		const options = {
			maxLength: {
				maxLength: 5
			}
		};
		const question = {
			fieldName: 'shortStatement'
		};
		const validationResult = await new WordValidator(options).validate(question).run(req);
		expect(validationResult.errors.length).toEqual(0);
	});
	it('should validate a string that satisfies multiple validator links', async () => {
		const req = {
			body: {
				shortStatement: 'I am not too short'
			}
		};
		const options = {
			minLength: {
				minLength: 3
			},
			maxLength: {
				maxLength: 5
			}
		};
		const question = {
			fieldName: 'shortStatement'
		};
		const validationResult = await new WordValidator(options).validate(question).run(req);
		expect(validationResult.errors.length).toEqual(0);
	});
	it('should invalidate a string that does not satisfy the minimum word validator, and not run the subsequent validation links', async () => {
		const req = {
			body: {
				shortStatement: 'one two'
			}
		};
		const options = {
			minLength: {
				minLength: 3,
				minLengthMessage: 'Short statement should be a minimum of 3 characters in length'
			},
			maxLength: {
				maxLength: 4,
				maxLengthMessage: 'Short statement should be a maximum of 4 characters in length'
			}
		};
		const question = {
			fieldName: 'shortStatement'
		};
		const validationResult = await new WordValidator(options).validate(question).run(req);
		expect(validationResult.errors.length).toEqual(1);
		expect(validationResult.errors[0].msg).toEqual(options.minLength.minLengthMessage);
	});
	it('should invalidate a string that does not satisfy the maximum word validator', async () => {
		const req = {
			body: {
				shortStatement: 'one two three four five'
			}
		};
		const options = {
			regex: {
				regex: '^[a].*$',
				regexMessage: 'Short message should be comprised of the letter a only'
			},
			minLength: {
				minLength: 1,
				minLengthMessage: 'Short statement should be a minimum of 1 characters in length'
			},
			maxLength: {
				maxLength: 4,
				maxLengthMessage: 'Short statement should be a maximum of 4 characters in length'
			}
		};
		const question = {
			fieldName: 'shortStatement'
		};
		const validationResult = await new WordValidator(options).validate(question).run(req);
		expect(validationResult.errors.length).toEqual(1);
		expect(validationResult.errors[0].msg).toEqual(options.maxLength.maxLengthMessage);
	});
});
