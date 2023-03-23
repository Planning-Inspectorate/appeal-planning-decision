const {
	postUploadDocuments
} = require('../../../../src/controllers/final-comment/upload-documents');

const { mockReq, mockRes } = require('../../mocks');

const mockFile = {
	name: 'test.png'
};

const mockFile2 = {
	name: 'another-file.jpg'
};

const mockUploadedFile = {
	name: 'test.png',
	fileName: 'test.png',
	originalFileName: 'test.png',
	message: {
		text: 'test.png'
	}
};

const mockUploadedFile2 = {
	name: 'another-file.jpg',
	fileName: 'another-file.jpg',
	originalFileName: 'another-file.jpg',
	message: {
		text: 'another-file.jpg'
	}
};

describe('controllers/final-comment/upload-documents', () => {
	let req;
	let res;

	beforeEach(() => {
		// mockReq by default sets an appeal field and places appeal object in session
		// so pass null and clear req.session to use for final comments
		req = {
			...mockReq(null),
			session: {},
			body: {
				files: {}
			}
		};
		res = mockRes();

		jest.resetAllMocks();
	});

	describe('postUploadDocuments', () => {
		it('sets session correctly when files added', async () => {
			req.body.files['upload-documents'] = [mockFile, mockFile2];

			await postUploadDocuments(req, res);

			expect(req.session.finalComment.supportingDocuments.uploadedFiles).toEqual([
				mockUploadedFile,
				mockUploadedFile2
			]);
		});

		it('sets session correctly when files removed', async () => {
			// upload files on first post request
			req.body.files['upload-documents'] = [mockFile, mockFile2];
			await postUploadDocuments(req, res);

			// remove one of the files on second post request
			req.body.files['upload-documents'] = null;
			req.body.removedFiles = `[{"name":"${mockUploadedFile.name}"}]`;
			await postUploadDocuments(req, res);

			expect(req.session.finalComment.supportingDocuments.uploadedFiles).toEqual([
				mockUploadedFile2
			]);
		});
	});
});
