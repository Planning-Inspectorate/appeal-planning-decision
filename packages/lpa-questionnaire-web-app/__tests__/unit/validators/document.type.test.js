const { documentTypes } = require('@pins/common');
const documentType = require('../../../src/validators/document-type');
const { mockReq, mockRes } = require('../mocks');

describe('validation/document-type', () => {
  const next = jest.fn();

  let req;
  let res;

  beforeEach(() => {
    req = mockReq();
    res = mockRes();
  });

  it('should call next when given a valid document type', () => {
    req.params.documentType = documentTypes.officersReport.name;

    documentType(req, res, next);

    expect(next).toBeCalledTimes(1);
    expect(next).toBeCalledWith();
  });

  it('should return an error when not given a document type', () => {
    documentType(req, res, next);

    expect(res.status).toBeCalledTimes(1);
    expect(res.status).toBeCalledWith(500);
    expect(res.json).toBeCalledTimes(1);
    expect(res.json).toBeCalledWith({
      error: {
        message: 'Unable to upload document',
      },
    });
  });

  it('should return an error when given an invalid document type', () => {
    req.params.documentType = 'pdf';

    documentType(req, res, next);

    expect(res.status).toBeCalledTimes(1);
    expect(res.status).toBeCalledWith(500);
    expect(res.json).toBeCalledTimes(1);
    expect(res.json).toBeCalledWith({
      error: {
        message: 'Unable to upload document',
      },
    });
  });
});
