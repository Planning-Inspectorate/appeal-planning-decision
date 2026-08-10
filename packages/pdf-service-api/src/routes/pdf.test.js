const { postGeneratePdf } = require('../controllers/pdf');
const { mockPost } = require('../../test/utils/mocks');
const bodyParser = require('body-parser');
const config = require('../config');

jest.mock('body-parser', () => ({
	raw: jest.fn(() => undefined)
}));

describe('routes/pdf', () => {
	it('should define the expected routes', () => {
		// eslint-disable-next-line global-require
		require('./pdf');

		const options = bodyParser.raw.mock.calls[0][0];

		expect(options.inflate).toBe(true);
		expect(options.limit).toBe(config.fileUpload.maxSizeInBytes);
		expect(options.type({ headers: { 'content-type': 'application/gzip' } })).toBe(true);
		expect(options.type({ headers: { 'content-type': 'text/html; charset=utf-8' } })).toBe(true);
		expect(options.type({ headers: { 'content-type': 'application/json' } })).toBe(false);
		expect(mockPost).toHaveBeenCalledWith('/generate', undefined, postGeneratePdf);
	});
});
