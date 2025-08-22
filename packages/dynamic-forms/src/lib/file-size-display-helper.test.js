const fileSizeDisplayHelper = require('./file-size-display-helper');

describe('lib/file-size-display-helper', () => {
	[
		{
			given: 0,
			expected: '0Bytes'
		},
		{
			given: 1,
			expected: '1Bytes'
		},
		{
			given: 1000,
			expected: '1KB'
		},
		{
			given: 1024,
			expected: '1KB'
		},
		{
			given: 1024 ** 2,
			expected: '1MB'
		},
		{
			given: 1000 ** 2,
			expected: '1MB'
		},
		{
			given: 26214400,
			expected: '25MB',
			binary: true
		},
		{
			given: 26214400,
			expected: '26MB',
			binary: false
		},
		{
			given: 1024 ** 3,
			expected: '1GB'
		},
		{
			given: 1000 ** 3,
			expected: '1GB'
		},
		{
			given: 1024 ** 4,
			expected: '1TB'
		},
		{
			given: 1000 ** 4,
			expected: '1TB'
		},
		{
			given: 1024 ** 5,
			expected: '1PB'
		},
		{
			given: 1000 ** 5,
			expected: '1PB'
		},
		{
			given: 1024 ** 6,
			expected: '1EB'
		},
		{
			given: 1000 ** 6,
			expected: '1EB'
		},
		{
			given: 1024 ** 7,
			expected: '1ZB'
		},
		{
			given: 1000 ** 7,
			expected: '1ZB'
		},
		{
			given: 1024 ** 8,
			expected: '1YB'
		},
		{
			given: 1000 ** 8,
			expected: '1YB'
		},
		{
			given: 50000000,
			expected: '50MB'
		},
		{
			given: 52428800,
			expected: '52MB'
		}
	].forEach(({ given, expected, binary = false }) => {
		it(`should display the expected file size - ${expected}`, () => {
			expect(fileSizeDisplayHelper(given, binary)).toBe(expected);
		});
	});
});
