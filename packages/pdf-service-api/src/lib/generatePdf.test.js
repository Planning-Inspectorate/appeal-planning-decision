const html = '<html><body><p>A test pdf</p></body></html>';
const mockPdfBuffer = Buffer.from(html);
const mockLaunch = jest.fn();

jest.unstable_mockModule('puppeteer-core', () => ({
	launch: mockLaunch
}));

const generatePdf = require('./generatePdf');

beforeEach(() => {
	mockLaunch.mockImplementation(() => ({
		newPage: () => ({
			setContent: jest.fn(),
			pdf: jest.fn().mockReturnValue(mockPdfBuffer),
			emulateMediaType: jest.fn()
		}),
		close: jest.fn()
	}));
});

describe('lib/generatePdf', () => {
	it('should return a pdf buffer', async () => {
		const result = await generatePdf(html);
		expect(result).toEqual(mockPdfBuffer);
	});

	it('should throw an error', async () => {
		mockLaunch.mockImplementation(() => {
			throw new Error('Internal Server Error');
		});

		try {
			await generatePdf(html);
			throw new Error('Expected error not thrown');
		} catch (err) {
			expect(err.message).toEqual('Error: Internal Server Error');
		}
	});
});
