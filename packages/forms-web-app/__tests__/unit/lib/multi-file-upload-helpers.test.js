const {
	getValidFiles,
	removeFiles,
	removeFilesV2
} = require('../../../src/lib/multi-file-upload-helpers');
const { removeDocument } = require('../../../src/lib/documents-api-wrapper');
const logger = require('../../../src/lib/logger');

jest.mock('../../../src/lib/documents-api-wrapper');
jest.mock('../../../src/lib/logger');

let testFiles;
const testBaseLocation = 'base-path';

describe('lib/multi-file-upload-helpers', () => {
	describe('getValidFiles', () => {
		it('returns array of files with invalid files removed', () => {
			const validFile = { name: 'scorpio.jpeg', tempFilePath: '/tmp/tmp-1-1679999844879' };
			const invalidFile = { name: 'globex.gif', tempFilePath: '/tmp/tmp-2-1679999844882' };

			const files = [validFile, invalidFile];

			const errors = {
				'files.upload-documents[1]': {
					value: {
						name: 'globex.gif',
						tempFilePath: '/tmp/tmp-2-1679999844882'
					}
				}
			};

			expect(getValidFiles(errors, files)).toEqual([validFile]);
		});
	});

	describe('removeFiles', () => {
		beforeEach(() => {
			jest.clearAllMocks();
			testFiles = [
				{ id: '1', name: 'fileName1.txt', originalFileName: 'file1.txt' },
				{ id: '2', name: 'fileName2.txt', originalFileName: 'file2.txt' },
				{ id: '3', name: 'fileName3.txt', originalFileName: 'file3.txt' }
			];
		});

		it('should remove files from the input array', async () => {
			const removedFiles = [
				{ name: testFiles[0].originalFileName },
				{ name: testFiles[2].originalFileName }
			];

			removeDocument.mockResolvedValue();

			const result = await removeFiles(testFiles, removedFiles, testBaseLocation);

			expect(removeDocument).toHaveBeenCalledTimes(2);
			expect(removeDocument).toHaveBeenCalledWith(testBaseLocation, testFiles[0].id);
			expect(removeDocument).toHaveBeenCalledWith(testBaseLocation, testFiles[2].id);
			expect(result).toEqual([testFiles[1]]);
		});

		it('should not modify the input array if no files are removed', async () => {
			const removedFiles = [];

			const result = await removeFiles(testFiles, removedFiles);

			expect(removeDocument).not.toHaveBeenCalled();
			expect(result).toEqual(testFiles);
		});

		it('should return an empty array if all files are removed', async () => {
			const removedFiles = [
				{ name: testFiles[0].originalFileName },
				{ name: testFiles[1].originalFileName },
				{ name: testFiles[2].originalFileName }
			];

			removeDocument.mockResolvedValue();

			const result = await removeFiles(testFiles, removedFiles, testBaseLocation);

			expect(removeDocument).toHaveBeenCalledTimes(3);
			expect(removeDocument).toHaveBeenCalledWith(testBaseLocation, testFiles[0].id);
			expect(removeDocument).toHaveBeenCalledWith(testBaseLocation, testFiles[1].id);
			expect(removeDocument).toHaveBeenCalledWith(testBaseLocation, testFiles[2].id);
			expect(result).toEqual([]);
		});

		it('should not remove from blob storage if baseLocation is not passed through', async () => {
			const removedFiles = [
				{ name: testFiles[0].originalFileName },
				{ name: testFiles[1].originalFileName },
				{ name: testFiles[2].originalFileName }
			];

			const result = await removeFiles(testFiles, removedFiles);

			expect(removeDocument).not.toHaveBeenCalled();
			expect(result).toEqual([]);
		});

		it('should indicate if a file failed to be removed but continue to process other files, array will be reorderd', async () => {
			const removedFiles = [
				{ name: testFiles[0].originalFileName },
				{ name: testFiles[2].originalFileName }
			];

			removeDocument.mockRejectedValueOnce(new Error('Removal failed'));
			removeDocument.mockResolvedValueOnce();

			const result = await removeFiles(testFiles, removedFiles, testBaseLocation);

			expect(logger.error).toHaveBeenCalledTimes(1);
			expect(removeDocument).toHaveBeenCalledTimes(2);
			expect(removeDocument).toHaveBeenCalledWith(testBaseLocation, testFiles[0].id);
			expect(removeDocument).toHaveBeenCalledWith(testBaseLocation, testFiles[2].id);
			expect(result).toEqual([
				testFiles[1],
				{
					...testFiles[0],
					failedToRemove: true
				}
			]);
		});

		it('should error with bad inputs', async () => {
			await expect(removeFiles()).rejects.toThrow();
		});
	});

	describe('removeFilesV2', () => {
		const mockDeleteDocumentUploadFunction = jest.fn();
		const testBaseLocation = 'base-path';
		const testReferenceId = 'ref-123';
		const testFiles = [
			{ id: '1', storageId: 's1', originalFileName: 'file1.txt' },
			{ id: '2', storageId: 's2', originalFileName: 'file2.txt' },
			{ id: '3', storageId: 's3', originalFileName: 'file3.txt' }
		];

		beforeEach(() => {
			jest.clearAllMocks();
		});

		it('removes files from blob and db', async () => {
			removeDocument.mockResolvedValue();
			mockDeleteDocumentUploadFunction.mockResolvedValue();
			const removedFiles = [{ name: 'file1.txt' }, { name: 'file3.txt' }];
			const result = await removeFilesV2(
				testFiles,
				removedFiles,
				testReferenceId,
				testBaseLocation,
				mockDeleteDocumentUploadFunction
			);
			expect(removeDocument).toHaveBeenCalledTimes(2);
			expect(removeDocument).toHaveBeenCalledWith(testBaseLocation, 's1');
			expect(removeDocument).toHaveBeenCalledWith(testBaseLocation, 's3');
			expect(mockDeleteDocumentUploadFunction).toHaveBeenCalledWith(testReferenceId, ['1', '3']);
			expect(result).toEqual([]);
		});

		it('returns failedRemovals if blob removal fails', async () => {
			removeDocument.mockRejectedValueOnce(new Error('fail'));
			removeDocument.mockResolvedValueOnce();
			mockDeleteDocumentUploadFunction.mockResolvedValue();
			const removedFiles = [{ name: 'file1.txt' }, { name: 'file3.txt' }];
			const result = await removeFilesV2(
				testFiles,
				removedFiles,
				testReferenceId,
				testBaseLocation,
				mockDeleteDocumentUploadFunction
			);
			expect(result).toEqual([{ storageId: 's1', originalFileName: 'file1.txt' }]);
		});

		it('returns failedRemovals if db removal fails', async () => {
			removeDocument.mockResolvedValue();
			mockDeleteDocumentUploadFunction.mockRejectedValue(new Error('fail'));
			const removedFiles = [{ name: 'file1.txt' }, { name: 'file3.txt' }];
			const result = await removeFilesV2(
				testFiles,
				removedFiles,
				testReferenceId,
				testBaseLocation,
				mockDeleteDocumentUploadFunction
			);
			expect(result).toEqual([
				{ storageId: 's1', originalFileName: 'file1.txt' },
				{ storageId: 's3', originalFileName: 'file3.txt' }
			]);
		});

		it('does nothing if no files match removedFiles', async () => {
			removeDocument.mockResolvedValue();
			mockDeleteDocumentUploadFunction.mockResolvedValue();
			const removedFiles = [{ name: 'notfound.txt' }];
			const result = await removeFilesV2(
				testFiles,
				removedFiles,
				testReferenceId,
				testBaseLocation,
				mockDeleteDocumentUploadFunction
			);
			expect(removeDocument).not.toHaveBeenCalled();
			expect(mockDeleteDocumentUploadFunction).toHaveBeenCalledWith(testReferenceId, []);
			expect(result).toEqual([]);
		});
	});
});
