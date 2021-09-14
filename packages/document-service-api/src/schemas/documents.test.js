jest.mock('mongoose', () => {
  // Auto-mocking isn't quite right on the virtual - doesn't return "get"
  return {
    model: jest.fn(),
    Schema: jest.fn(),
  };
});

const { when } = require('jest-when');
const mongoose = require('mongoose');
const Methods = require('./documentsMethods');

const getMock = jest.fn().mockImplementationOnce();
const virtualMock = jest.fn().mockImplementationOnce(() => ({
  get: getMock,
}));
mongoose.Schema.mockImplementation(() => ({
  index: jest.fn(),
  loadClass: jest.fn(),
  set: jest.fn(),
  virtual: virtualMock,
}));

require('./documents');

describe('Documents Schema', () => {
  let schema;
  beforeEach(() => {
    expect(mongoose.model.mock.calls[0][0]).toBe('Document');
    // eslint-disable-next-line prefer-destructuring
    schema = mongoose.model.mock.calls[0][1];

    expect(schema.loadClass).toBeCalledWith(Methods);
  });

  describe('indices', () => {
    it('should create an index on applicationId and id', () => {
      expect(schema.index).toBeCalledWith({
        applicationId: 1,
        id: 1,
      });
    });

    it('should create an index on createdAt', () => {
      expect(schema.index).toBeCalledWith({
        createdAt: 1,
      });
    });

    it('should create an index on upload.processed and upload.processAttempted', () => {
      expect(schema.index).toBeCalledWith({
        'upload.processed': 1,
        'upload.processAttempts': 1,
      });
    });
  });

  describe('virtuals', () => {
    it('should have virtuals enabled by default on toObject', () => {
      expect(schema.set).toBeCalledWith('toObject', { virtuals: true });
    });

    it('should have virtuals enabled by default on toJSON', () => {
      expect(schema.set).toBeCalledWith('toJSON', { virtuals: true });
    });

    describe('#blobStorageLocation', () => {
      it('should output the blob storage location from the appId, id and name fields', () => {
        expect(virtualMock).toHaveBeenNthCalledWith(1, 'blobStorageLocation');

        const mock = getMock.mock.calls[0][0];

        const state = {
          get: jest.fn(),
        };
        when(state.get).calledWith('applicationId').mockReturnValue('some-app-id');
        when(state.get).calledWith('id').mockReturnValue('some-id');
        when(state.get).calledWith('name').mockReturnValue('some-name');

        expect(mock.call(state)).toBe('some-app-id/some-id/some-name');
      });
    });
  });
});
