const fs = require('fs');
const getYamlAsJson = require('./getYamlAsJson');

const mockFilePath = '../../api/openapi.yaml';
const mockFileContents = `mocked: true
test:
  nested: 1
`;

jest.mock('fs', () => ({
	readFileSync: jest.fn()
}));

jest.mock('../lib/logger', () => ({
	debug: jest.fn(),
	error: jest.fn()
}));

describe('lib/getYamlAsJson', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should return the file data', () => {
		fs.readFileSync.mockReturnValue(mockFileContents);

		const result = getYamlAsJson(mockFilePath);

		expect(fs.readFileSync).toHaveBeenCalledTimes(1);
		expect(fs.readFileSync).toHaveBeenCalledWith(mockFilePath, 'utf8');

		expect(result).toEqual({
			mocked: true,
			test: {
				nested: 1
			}
		});
	});

	it('should return null when the file cannot be loaded', () => {
		fs.readFileSync.mockImplementation(() => {
			throw new Error('Internal Server Error');
		});

		const result = getYamlAsJson(mockFilePath);

		expect(fs.readFileSync).toHaveBeenCalledTimes(1);
		expect(fs.readFileSync).toHaveBeenCalledWith(mockFilePath, 'utf8');

		expect(result).toBeNull();
	});
});
