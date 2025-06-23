const { postGeneratePdf } = require('../controllers/pdf');
const { mockPost } = require('../../test/utils/mocks');
const multer = require('multer');
const config = require('../config');

jest.mock('multer', () =>
	jest.fn().mockReturnValue({
		single: jest.fn()
	})
);

describe('routes/pdf', () => {
	it('should define the expected routes', () => {
		// eslint-disable-next-line global-require
		require('./pdf');

		expect(mockPost).toHaveBeenCalledTimes(1);
		expect(mockPost).toHaveBeenCalledWith(
			'/generate',
			multer(config.fileUpload).single('html'),
			postGeneratePdf
		);
	});
});
