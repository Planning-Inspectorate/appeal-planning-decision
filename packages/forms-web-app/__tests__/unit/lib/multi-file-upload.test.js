const { getValidFiles, removeFiles } = require('../../../src/lib/multi-file-upload-helpers');

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
	it('returns array of files with specified files removed ', () => {
		const file1 = { name: 'file1.jpeg', originalFileName: 'file1.jpeg' };
		const file2 = { name: 'file2.jpeg', originalFileName: 'file2.jpeg' };
		const file3 = { name: 'file3.jpeg', originalFileName: 'file3.jpeg' };

		const files = [file1, file2, file3];
		const removedFiles = [{ name: file1.name }, { name: file3.name }];

		expect(removeFiles(files, removedFiles)).toEqual([file2]);
	});
});
