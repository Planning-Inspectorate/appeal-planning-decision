const { getValidFiles, removeFiles } = require('../../../src/lib/multi-file-upload-helpers');
let testFiles;

describe('lib/multi-file-upload-helpers/getValidFiles', () => {
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

describe('lib/multi-file-upload-helpers/removeFiles', () => {
	beforeEach(() => {
		testFiles = [
			{ name: 'file1.txt', originalFileName: 'file1.txt' },
			{ name: 'file2.txt', originalFileName: 'file2.txt' },
			{ name: 'file3.txt', originalFileName: 'file3.txt' }
		];
	});

	it('should remove files from the input array', async () => {
		const removedFiles = [{ name: 'file1.txt' }, { name: 'file3.txt' }];

		const result = await removeFiles(testFiles, removedFiles);

		expect(result).toEqual([testFiles[1]]);
	});

	it('should not modify the input array if no files are removed', async () => {
		const removedFiles = [];

		const result = await removeFiles(testFiles, removedFiles);

		expect(result).toEqual(testFiles);
	});

	it('should return an empty array if all files are removed', async () => {
		const removedFiles = [{ name: 'file1.txt' }, { name: 'file2.txt' }, { name: 'file3.txt' }];

		const result = await removeFiles(testFiles, removedFiles);

		expect(result).toEqual([]);
	});
});
