const validateFileSize = require('./file-size');

describe('validators/custom/file-size', () => {
	it('should be valid when given a smaller file size than the configured maximum', () => {
		expect(validateFileSize(1024, 2048)).toBeTruthy();
	});

	it('should be valid when given a file size that matches the configured maximum', () => {
		expect(validateFileSize(1024, 1024)).toBeTruthy();
	});

	it('should throw custom error message if provided and file oversize', () => {
		expect(() =>
			validateFileSize(2048, 1024, 'OversizeFile', 'The selected file must be smaller than 1KB')
		).toThrow('The selected file must be smaller than 1KB');
	});

	it('should be valid and not throw custom error message if provided and file not oversize', () => {
		expect(() =>
			validateFileSize(1023, 1024, 'OversizeFile', 'The selected file must be smaller than 1KB')
		).not.toThrow('The selected file must be smaller than 1KB');
		expect(
			validateFileSize(1023, 1024, 'OversizeFile', 'The selected file must be smaller than 1KB')
		).toBeTruthy();
	});

	describe('should throw when oversize', () => {
		const testSetup = () => [
			{
				givenFileSize: 1,
				maxFileSize: 0,
				expectedErrorMessage: (filename) => `${filename} must be smaller than 0Bytes`
			},
			{
				givenFileSize: 2,
				maxFileSize: 1,
				expectedErrorMessage: (filename) => `${filename} must be smaller than 1Bytes`
			},
			{
				givenFileSize: 2048,
				maxFileSize: 1024,
				expectedErrorMessage: (filename) => `${filename} must be smaller than 1KB`
			},
			{
				givenFileSize: 1024 ** 2 + 1,
				maxFileSize: 1024 ** 2,
				expectedErrorMessage: (filename) => `${filename} must be smaller than 1MB`
			},
			{
				givenFileSize: 1024 ** 3 + 1,
				maxFileSize: 1024 ** 3,
				expectedErrorMessage: (filename) => `${filename} must be smaller than 1GB`
			},
			{
				givenFileSize: 1024 ** 4 + 1,
				maxFileSize: 1024 ** 4,
				expectedErrorMessage: (filename) => `${filename} must be smaller than 1TB`
			},
			{
				givenFileSize: 1024 ** 5 + 1,
				maxFileSize: 1024 ** 5,
				expectedErrorMessage: (filename) => `${filename} must be smaller than 1PB`
			},
			{
				givenFileSize: 1024 ** 7,
				maxFileSize: 1024 ** 6,
				expectedErrorMessage: (filename) => `${filename} must be smaller than 1EB`
			},
			{
				givenFileSize: 1024 ** 8,
				maxFileSize: 1024 ** 7,
				expectedErrorMessage: (filename) => `${filename} must be smaller than 1ZB`
			},
			{
				givenFileSize: 1024 ** 9,
				maxFileSize: 1024 ** 8,
				expectedErrorMessage: (filename) => `${filename} must be smaller than 1YB`
			}
		];

		testSetup().forEach(({ givenFileSize, maxFileSize, expectedErrorMessage }) => {
			it(`generic file name - ${givenFileSize}`, () => {
				expect(() => validateFileSize(givenFileSize, maxFileSize)).toThrow(
					expectedErrorMessage('The selected file')
				);
			});
		});

		testSetup().forEach(({ givenFileSize, maxFileSize, expectedErrorMessage }) => {
			it(`specific file name - ${givenFileSize}`, () => {
				const fileName = 'Some file name.png';
				expect(() => validateFileSize(givenFileSize, maxFileSize, fileName)).toThrow(
					expectedErrorMessage(fileName)
				);
			});
		});
	});
});
