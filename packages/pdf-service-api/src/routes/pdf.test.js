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

		expect(multer).toHaveBeenCalledWith({
			limits: {
				fileSize: config.fileUpload.maxSizeInBytes,
				fieldSize: config.fileUpload.maxSizeInBytes
			},
			dest: config.fileUpload.path
		});
		expect(mockPost).toHaveBeenCalledWith('/generate', undefined, postGeneratePdf);
	});
});
