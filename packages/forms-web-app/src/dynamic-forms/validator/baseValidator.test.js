const BaseValidator = require('./baseValidator');

describe('src/dynamic-forms/validator/baseValidator.js', () => {
	it('should not be possible to instantiate the base class', () => {
		expect(() => new BaseValidator()).toThrow("Abstract classes can't be instantiated.");
	});
	it('should be possible to inherit from the base class', () => {
		class MyValidator extends BaseValidator {}

		const myValidator = new MyValidator();
		expect(myValidator.constructor).toEqual(MyValidator);
		expect(myValidator instanceof BaseValidator).toEqual(true);
	});
});
