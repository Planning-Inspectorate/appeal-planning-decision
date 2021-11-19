const fs = require('fs');
const yaml = require('js-yaml');
const getYamlAsJson = require('../../../lib/getYamlAsJson');

const fileContents = { mocked: true };
const filePath = '../../api/openapi.yaml';

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

yaml.safeLoad.mockReturnValue(fileContents);

describe('lib/getYamlAsJson', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return the file data', () => {
    fs.readFileSync.mockReturnValue(fileContents);

    const result = getYamlAsJson(filePath);

    expect(fs.readFileSync).toBeCalledTimes(1);
    expect(fs.readFileSync).toBeCalledWith(filePath, 'utf8');

    expect(yaml.safeLoad).toBeCalledTimes(1);
    expect(yaml.safeLoad).toBeCalledWith(fileContents);

    expect(result).toEqual(fileContents);
  });

  it('should return null when the file cannot be loaded', () => {
    fs.readFileSync.mockImplementation(() => {
      throw new Error('Internal Server Error');
    });

    const result = getYamlAsJson(filePath);

    expect(fs.readFileSync).toBeCalledTimes(1);
    expect(fs.readFileSync).toBeCalledWith(filePath, 'utf8');

    expect(yaml.safeLoad).not.toBeCalled();

    expect(result).toBeNull();
  });
});
