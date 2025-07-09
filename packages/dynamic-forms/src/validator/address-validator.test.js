const { validationResult } = require('express-validator');
const AddressValidator = require('./address-validator');

const addressLine1MaxLength = 10;
const addressLine2MaxLength = 10;
const townCityMaxLength = 10;
const postcodeMaxLength = 7;

describe('AddressValidator', () => {
	it('should validate a valid address without errors', async () => {
		const question = {
			fieldName: 'testField'
		};

		const req = {
			body: {
				testField_addressLine1: 'A Building',
				testField_addressLine2: 'A Street',
				testField_townCity: 'Test town',
				testField_postcode: 'WC2A2ZA'
			}
		};

		const errors = await _validationMappedErrors(req, question);

		expect(Object.keys(errors).length).toBe(0);
	});

	it('should validate address with empty addressLine2 and county without errors', async () => {
		const question = {
			fieldName: 'testField'
		};

		const req = {
			body: {
				testField_addressLine1: 'A Building',
				testField_addressLine2: '',
				testField_townCity: 'Test city',
				testField_postcode: 'BS1 6PN',
				county: ''
			}
		};

		const errors = await _validationMappedErrors(req, question);

		expect(Object.keys(errors).length).toBe(0);
	});

	it('should reject invalid address (no addressLine1 or townCity) with errors', async () => {
		const question = {
			fieldName: 'testField'
		};

		const req = {
			body: {
				testField_addressLine1: '',
				testField_addressLine2: 'A Street',
				testField_townCity: '',
				testField_postcode: 'L2 3BX'
			}
		};

		const errors = await _validationMappedErrors(req, question);

		expect(Object.keys(errors).length).toBe(2);
		expect(errors.testField_addressLine1.msg).toEqual('Enter address line 1');
		expect(errors.testField_townCity.msg).toEqual('Enter town or city');
	});

	it('should reject invalid address with too long fields with errors', async () => {
		const question = {
			fieldName: 'testField'
		};

		const req = {
			body: {
				testField_addressLine1: '*'.repeat(addressLine1MaxLength + 1),
				testField_addressLine2: '*'.repeat(addressLine2MaxLength + 1),
				testField_townCity: '*'.repeat(townCityMaxLength + 1),
				testField_postcode: '*'.repeat(postcodeMaxLength + 1)
			}
		};

		const errors = await _validationMappedErrors(req, question);

		expect(Object.keys(errors).length).toBe(4);
		expect(errors.testField_addressLine1.msg).toEqual(
			`The address line must be ${addressLine1MaxLength} characters or fewer`
		);
		expect(errors.testField_addressLine2.msg).toEqual(
			`The address line must be ${addressLine2MaxLength} characters or fewer`
		);
		expect(errors.testField_townCity.msg).toEqual(
			`Town or city must be ${townCityMaxLength} characters or fewer`
		);
		expect(errors.testField_postcode.msg).toEqual('Enter a full UK postcode');
	});
});

const _validationMappedErrors = async (req, question) => {
	const addressValidator = new AddressValidator({
		addressLine1MaxLength,
		addressLine2MaxLength,
		townCityMaxLength,
		postcodeMaxLength
	});

	const validationRules = addressValidator.validate(question);

	await Promise.all(validationRules.map((validator) => validator.run(req)));

	const errors = validationResult(req);

	return errors.mapped();
};
