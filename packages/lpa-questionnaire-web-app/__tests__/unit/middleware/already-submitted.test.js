const { VIEW } = require('../../../src/lib/views');
const alreadySubmittedMiddleware = require('../../../src/middleware/already-submitted');
const { mockReq, mockRes } = require('../mocks');

const appealId = 'd7e188bd-c695-4c5a-8d9d-50c66c3c688f';

describe('middleware/already-submitted', () => {
  let req;
  let res;

  const next = jest.fn();

  beforeEach(() => {
    req = mockReq();
    res = mockRes();
  });

  it('should redirct to 404 if appealId does not exist', async () => {
    req.params = {};

    await alreadySubmittedMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.send).toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });

  it('should redirct to 404 if appealReply does not exist', async () => {
    req.params = { id: appealId };
    req.session = {};

    await alreadySubmittedMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.send).toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });

  it(`should reditect to /appeal-questionnaire/${appealId}/${VIEW.ALREADY_SUBMITTED} when questionnaire state is SUBMITTED`, async () => {
    req.params = { id: appealId };
    req.session.appealReply = { state: 'SUBMITTED' };

    await alreadySubmittedMiddleware(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.redirect).toHaveBeenCalledWith(
      `/appeal-questionnaire/${appealId}/${VIEW.ALREADY_SUBMITTED}`
    );
  });

  it(`should call the next middleware function in the stack when questionnaire state is not SUBMITTED`, async () => {
    req.params = { id: appealId };
    req.session.appealReply = { state: '' };

    await alreadySubmittedMiddleware(req, res, next);

    expect(next).toHaveBeenCalled();
  });
});
