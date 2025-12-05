const {
	fileUpload: {
		pins: { maxFileUploadSize }
	}
} = require('../../../../../src/config');
const fileUploadSchema = require('../../../../../src/validators/common/schemas/file-upload');
const validateFileSize = require('../../../../../src/validators/custom/file-size');
const file = require('../../../../fixtures/file-upload');
const invalidFile = { ...file, mimetype: 'not/valid' };

jest.mock('../../../../../src/validators/custom/file-size');
const mockScan = jest.fn();
jest.mock('@pins/common/src/client/clamav-client', () => {
	return jest.fn().mockImplementation(() => {
		return { scan: mockScan };
	});
});

describe('validators/common/schemas/file-upload', () => {
	let req;

	const sectionName = 'requiredDocumentsSection';
	const taskName = 'originalApplication';

	beforeEach(() => {
		req = {
			session: { appeal: {} },
			files: {},
			sectionName,
			taskName
		};
	});

	it('has a defined custom schema object', () => {
		expect(fileUploadSchema()['file-upload'].custom.options).toBeDefined();
	});

	describe(`schema['file-upload'].custom.options`, () => {
		const noFilesError = 'Select your planning application form';
		const noFilesErrorDefault = 'Select a file to upload';

		let schema;

		beforeEach(() => {
			schema = fileUploadSchema()['file-upload'].custom.options;
		});

		it('should return true if req.files is null and a single file has already been uploaded', async () => {
			req.files = null;
			req.session = {
				appeal: {
					[sectionName]: {
						[taskName]: {
							uploadedFile: file
						}
					}
				}
			};

			const result = schema(null, { req });

			expect(result).toBeTruthy();
		});

		it('should return true if req.files is null and multiple files already been uploaded', async () => {
			req.files = null;
			req.session = {
				appeal: {
					[sectionName]: {
						[taskName]: {
							uploadedFiles: [file, file]
						}
					}
				}
			};

			const result = schema(null, { req });

			expect(result).toBeTruthy();
		});

		it('should throw the correct error if req.files is null and noFilesError is not given', () => {
			req.files = null;

			expect(() => schema(null, { req })).rejects.toThrow(noFilesErrorDefault);
		});

		it('should throw the correct error if req.files is null and noFilesError is given', () => {
			req.files = null;
			schema = fileUploadSchema(noFilesError)['file-upload'].custom.options;

			expect(() => schema(null, { req })).rejects.toThrow(noFilesError);
		});

		it('should throw the correct error if a file has not been uploaded and noFilesError is not given', () => {
			req.files = null;

			expect(() => schema(null, { req })).rejects.toThrow(noFilesErrorDefault);
		});

		it('should throw the correct error if a file has not been uploaded and noFilesError is given', () => {
			req.files = null;

			schema = fileUploadSchema(noFilesError)['file-upload'].custom.options;

			expect(() => schema(null, { req })).rejects.toThrow(noFilesError);
		});

		it('should call the validateFileSize validator when given a single file', async () => {
			req.files = { 'file-upload': file };

			await schema(null, { req, path: 'file-upload' });

			expect(validateFileSize).toHaveBeenCalledWith(file.size, maxFileUploadSize, file.name);
		});

		it('should call the antivirus validator when given a single file', async () => {
			req.files = { 'file-upload': file };

			await schema(null, { req, path: 'file-upload' });

			expect(mockScan).toHaveBeenCalledTimes(1);
			expect(mockScan).toHaveBeenCalledWith(file, file.name);
		});

		it('should call the validateFileSize validator when given multiple files', async () => {
			req.files = { 'file-upload': [file, file, file] };

			await schema(null, { req, path: 'file-upload' });

			expect(validateFileSize).toHaveBeenCalledWith(file.size, maxFileUploadSize, file.name);
		});

		it('should return true when given a single valid file', async () => {
			req.files = { 'file-upload': file };

			const result = await schema(null, { req, path: 'file-upload' });

			expect(result).toBeTruthy();
		});

		it('should return true when given multiple valid files', async () => {
			req.files = { 'file-upload': [file, file, file] };

			const result = await schema(null, { req, path: 'file-upload' });

			expect(result).toBeTruthy();
		});

		it('should throw error if file is not a valid mimetype (singlefile)', async () => {
			req.files = { 'file-upload': [invalidFile] };

			try {
				await schema(null, { req, path: 'file-upload' });
			} catch (err) {
				expect(err.message).toEqual(
					`${invalidFile.fileName} must be a DOC, DOCX, PDF, TIF, JPG, PNG or XLSX`
				);
			}
		});

		it('should throw error if file is not a valid mimetype (multifile', async () => {
			req.files = { 'file-upload': [file, invalidFile, file] };

			try {
				await schema(null, { req, path: 'file-upload' });
			} catch (err) {
				expect(err.message).toEqual(
					`${invalidFile.name} must be a DOC, DOCX, PDF, TIF, JPG, PNG or XLSX`
				);
			}
		});
	});
});
