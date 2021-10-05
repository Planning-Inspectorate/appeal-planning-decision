const fs = require('fs');
const yaml = require('js-yaml');
const getYamlAsJson = require('../../../lib/getYamlAsJson');

const mockFileContents = { mocked: true };
const mockFilePath = '../../api/openapi.yaml';

jest.mock('fs', () => ({
  readFileSync: jest.fn(),
}));

jest.mock('js-yaml', () => ({
  safeLoad: jest.fn(),
}));

jest.mock('../../../src/util/logger', () => ({
  debug: jest.fn(),
  error: jest.fn(),
}));

yaml.safeLoad.mockReturnValue(mockFileContents);

describe('lib/getYamlAsJson', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return the file data', () => {
    fs.readFileSync.mockReturnValue(mockFileContents);

    const result = getYamlAsJson(mockFilePath);

    expect(fs.readFileSync).toBeCalledTimes(1);
    expect(fs.readFileSync).toBeCalledWith(mockFilePath, 'utf8');

    expect(yaml.safeLoad).toBeCalledTimes(1);
    expect(yaml.safeLoad).toBeCalledWith(mockFileContents);

    expect(result).toEqual(mockFileContents);
  });

  it('should return null when the file cannot be loaded', () => {
    fs.readFileSync.mockImplementation(() => {
      throw new Error('Internal Server Error');
    });

    const result = getYamlAsJson(mockFilePath);

    expect(fs.readFileSync).toBeCalledTimes(1);
    expect(fs.readFileSync).toBeCalledWith(mockFilePath, 'utf8');

    expect(yaml.safeLoad).not.toBeCalled();

    expect(result).toBeNull();
  });
});
