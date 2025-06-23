const fs = require('fs');
const deleteLocalFile = require('./deleteLocalFile');

jest.mock('../configuration/config', () => ({
	fileUpload: {
		path: '/path/to/file/'
	}
}));

jest.mock('../lib/logger', () => ({
	info: jest.fn(),
	error: jest.fn()
}));

jest.mock('fs', () => ({
	writeSync: jest.fn().mockReturnValue(1),
	promises: {
		unlink: jest.fn()
	}
}));

describe('lib/deleteLocalFile', () => {
	const file = {
		filename: '/path/to/file/test-pdf.pdf'
	};

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should delete the local file', async () => {
		await deleteLocalFile(file);

		expect(fs.promises.unlink).toHaveBeenCalledTimes(1);
	});

	it('should throw an error when an error occurs', async () => {
		fs.promises.unlink = jest.fn().mockImplementation(() => {
			throw new Error('Internal Server Error');
		});

		try {
			await deleteLocalFile(file);
			throw new Error('Expected error not thrown');
		} catch (err) {
			expect(err.message).toEqual('Internal Server Error');
		}
	});
});
