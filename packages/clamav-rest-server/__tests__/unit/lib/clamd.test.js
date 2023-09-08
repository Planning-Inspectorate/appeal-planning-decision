const { sendFile } = require('../../../src/lib/clamd');

jest.mock('clamscan', () => {
	return jest.fn().mockImplementation(() => {
		return {
			init: () => {
				return Promise.resolve({
					scanStream: () => {
						return Promise.resolve({ isInfected: null });
					},
					getVersion: () => {
						return '1';
					}
				});
			}
		};
	});
});

describe('lib/clamd', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should send invalid file', async () => {
		await expect(() => sendFile(undefined).rejects.toThrowError('invalid or empty file'));
	});

	it("should send variable that's not a buffer", async () => {
		await expect(() =>
			sendFile('hello').rejects.toThrowError('invalid file type, requires a buffer')
		);
	});

	it('should throw error when is infected is null', async () => {
		var file = Buffer.from('abc');
		await expect(() => sendFile(file).rejects.toThrowError('Could not scan file'));
	});
});
