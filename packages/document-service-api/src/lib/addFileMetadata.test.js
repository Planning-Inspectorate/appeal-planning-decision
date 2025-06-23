const addFileMetadata = require('./addFileMetadata');
const { mockReq, mockRes, mockNext: next } = require('../../test/utils/mocks');

describe('lib/addFileMetadata', () => {
	const res = mockRes();

	let req;

	beforeEach(() => {
		req = { ...mockReq };
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should add the file metadata when req.file exists', () => {
		req.file = {};

		addFileMetadata(req, res, next);

		expect(req.file.id).toBeDefined();
		expect(req.file.uploadDate).toBeDefined();
		expect(next).toHaveBeenCalledTimes(1);
		expect(next).toHaveBeenCalledWith();
	});

	it('should add the file metadata when req.file does not exist', () => {
		addFileMetadata(req, res, next);

		expect(req.file.id).toBeDefined();
		expect(req.file.uploadDate).toBeDefined();
		expect(next).toHaveBeenCalledTimes(1);
		expect(next).toHaveBeenCalledWith();
	});
});
