const buildZipFilename = require('./build-zip-filename');

describe('buildZipFilename', () => {
	beforeEach(() => {
		jest.spyOn(Date.prototype, 'toISOString').mockReturnValue('2024-07-01T12:34:56.789Z');
	});
	afterAll(() => {
		jest.resetAllMocks();
	});

	it('should build a filename with appeal number, stage, and timestamp', () => {
		const isoString = '2024-07-01T12:34:56.789Z';
		jest.spyOn(Date.prototype, 'toISOString').mockReturnValue(isoString);

		const result = buildZipFilename('12345', 'SUBMISSION');
		expect(result).toBe('appeal_12345_SUBMISSION_20240701123456.zip');
	});

	it('should handle different appeal numbers and stages', () => {
		const isoString = '2025-01-02T03:04:05.000Z';
		jest.spyOn(Date.prototype, 'toISOString').mockReturnValue(isoString);

		const result = buildZipFilename('A1B2C3', 'FINAL');
		expect(result).toBe('appeal_A1B2C3_FINAL_20250102030405.zip');
	});
});
