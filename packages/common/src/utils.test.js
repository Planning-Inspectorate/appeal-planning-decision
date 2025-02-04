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

		it('should return true if test2 ONS code', async () => {
			const testONSCode = 'E69999991';
			expect(util.isTestLPA(testONSCode)).toEqual(true);
		});

		it('should return true if test lpa code', async () => {
			const testLpaCode = 'Q9999';
			expect(util.isTestLPA(testLpaCode)).toEqual(true);
		});

		it('should return true if test2 lpa code', async () => {
			const testLpaCode = 'Q1111';
			expect(util.isTestLPA(testLpaCode)).toEqual(true);
		});

		it('should return false if not test lpa code', async () => {
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

	describe('conjoinedPromises', () => {
		it('returns a map of objects to associated promise resolutions', async () => {
			const testObjArr = [1, 2, 3, 4];
			const testAsyncFunction = async (n) => n;

			const result = await util.conjoinedPromises(testObjArr, testAsyncFunction);

			expect(result).toEqual(
				new Map([
					[1, 1],
					[2, 2],
					[3, 3],
					[4, 4]
				])
			);
		});

		it('returns a map that allows for internal transformation of objects without affecting map keys', async () => {
			const testObjArr = [{ a: 'a' }, { a: 'b' }];
			const testAsyncFunction = async (str) => (str += 'b');

			const result = await util.conjoinedPromises(testObjArr, (obj) => testAsyncFunction(obj.a));

			expect(result).toEqual(
				new Map([
					[{ a: 'a' }, 'ab'],
					[{ a: 'b' }, 'bb']
				])
			);
			expect(result.get(testObjArr[0])).toBe('ab');
			expect(result.get(testObjArr[1])).toBe('bb');
		});

		it('allows the provision of multiple arguments to the promise', async () => {
			const testObjArr = [
				{ a: 'a', b: 1 },
				{ a: 'b', b: 2 }
			];
			const testAsyncFunction = async (str, num) => {
				console.log(str, num);
				return str + num;
			};

			const result = await util.conjoinedPromises(testObjArr, (obj) =>
				testAsyncFunction(obj.a, obj.b)
			);

			expect(result).toEqual(
				new Map([
					[{ a: 'a', b: 1 }, 'a1'],
					[{ a: 'b', b: 2 }, 'b2']
				])
			);
			expect(result.get(testObjArr[0])).toBe('a1');
			expect(result.get(testObjArr[1])).toBe('b2');
		});

		it('Runs the promises in parallel', async () => {
			/**
			 * @param {number} ms
			 * @returns Promise<string>
			 */
			const promiser = (ms) =>
				new Promise((resolve) => {
					setTimeout(() => {
						resolve(`Waited ${ms}ms`);
					}, ms);
				});

			const then = new Date();
			await util.conjoinedPromises([100, 200, 300, 400], promiser);
			const now = new Date();

			// allow single digit ms for sync processes
			expect(now - then).toBeCloseTo(400, -1);
		});
	});
});
