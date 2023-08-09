const util = require('./utils');

describe('Utils test', () => {
	describe('#promiseTimeout', () => {
		it('should resolve a promise that is settled within the timeout', async () => {
			const response = 'yay';
			const timeout = 10;

			const promise = async () => response;

			await expect(util.promiseTimeout(timeout, promise())).resolves.toEqual(response);
		});

		it('should reject a promise that is settled within the timeout', async () => {
			const err = new Error('some-error');
			const timeout = 10;

			const promise = async () => {
				throw err;
			};

			await expect(util.promiseTimeout(timeout, promise())).rejects.toEqual(err);
		});

		it('should reject a promise that exceeds the timeout', async () => {
			const timeout = 10;
			const promise = async () => {
				await new Promise((resolve) => setTimeout(resolve, timeout * 2)); // 1 ms more may not be enough for nextTick
				return 'hooray';
			};

			await expect(util.promiseTimeout(timeout, promise())).rejects.toEqual(new Error('timeout'));
		});
	});

	describe('isTestLPA', () => {
		it('should return true if test ONS code', async () => {
			const testONSCode = 'E69999999';
			expect(util.isTestLPA(testONSCode)).toEqual(true);
		});

		it('should return true if test lpa code', async () => {
			const testLpaCode = 'Q9999';
			expect(util.isTestLPA(testLpaCode)).toEqual(true);
		});

		it('should return false if test lpa code', async () => {
			const testLpaCode = 'Q0000';
			expect(util.isTestLPA(testLpaCode)).toEqual(false);
		});
	});

	describe('sanitizeCharactersInFilename', () => {
		it('should return the filename unchanged if it is empty or not a string', () => {
			const filename = null;
			const sanitized = util.sanitizeCharactersInFilename(filename);
			expect(sanitized).toBeNull();
		});

		it('should remove leading and trailing whitespace from the filename', () => {
			const filename = '  \texample.txt   ';
			const sanitized = util.sanitizeCharactersInFilename(filename);
			expect(sanitized).toBe('example.txt');
		});

		it('should replace disallowed characters with hyphens', () => {
			const filename = 'fi@le_n#ame.txt';
			const sanitized = util.sanitizeCharactersInFilename(filename);
			expect(sanitized).toBe('fi-le_n-ame.txt');
		});

		it('should truncate the filename to the specified maximum length', () => {
			const filename = 'this_is_a_long_filename_with_many_characters.txt';
			const maxLength = 10;
			const sanitized = util.sanitizeCharactersInFilename(filename, maxLength);
			expect(sanitized).toHaveLength(maxLength + 4);
			expect(sanitized).toEqual('this_is_a_.txt');
		});

		it('should truncate the filename to 200 chars when when no maxlength is specified but keep the extension intact', () => {
			const filename = 'a' + 'b'.repeat(250) + '.tst.txt';
			const sanitized = util.sanitizeCharactersInFilename(filename);
			expect(sanitized).toHaveLength(208);
			expect(sanitized).toMatch(new RegExp('.tst.txt$'));
		});

		it('should handle filenames with no disallowed characters', () => {
			const filename = 'this_is_a_valid_filename.txt';
			const sanitized = util.sanitizeCharactersInFilename(filename);
			expect(sanitized).toBe(filename);
		});

		it('should handle filenames with no extensions', () => {
			const filename = 'a#a';
			const sanitized = util.sanitizeCharactersInFilename(filename);
			expect(sanitized).toBe('a-a');
		});
	});
});
