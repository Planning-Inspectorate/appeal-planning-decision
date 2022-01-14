jest.mock('../../../src/lib/appeals-api-wrapper');

const moment = require('moment');
const alreadySubmittedController = require('../../../src/controllers/already-submitted');
const { getAppeal } = require('../../../src/lib/appeals-api-wrapper');
const { VIEW } = require('../../../src/lib/views');
const { mockReq, mockRes } = require('../mocks');

describe('controllers/already-submitted', () => {
  const req = mockReq();
  const res = mockRes();

  describe('GET /appeal-questionnaire/:lpaCode/already-submitted', () => {
    it('should call the correct template and respond with an error - 404 Not Found when appealid is missing', async () => {
      req.params = {};

      await alreadySubmittedController.getAlreadySubmitted(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalled();
      expect(getAppeal).not.toHaveBeenCalledWith(req.params.id);
    });

    it('should call the correct template and respond with an error - 404 Not Found when questionnaire is missing', async () => {
      req.params = { id: '6546a75e-6e8b-4c47-ad53-c4ed7e634638' };
      req.session = {};

      await alreadySubmittedController.getAlreadySubmitted(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalled();
      expect(getAppeal).not.toHaveBeenCalledWith(req.params.id);
    });

    it('should call the correct template', async () => {
      req.params = { id: '6546a75e-6e8b-4c47-ad53-c4ed7e634638' };
      req.session = { appealReply: { state: 'SUBMITTED' } };
      getAppeal.mockRejectedValue('API is down');

      await alreadySubmittedController.getAlreadySubmitted(req, res);

      expect(getAppeal).toHaveBeenCalledWith(req.params.id);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalled();
    });

    it('should call the correct template', async () => {
      req.params = { id: '6546a75e-6e8b-4c47-ad53-c4ed7e634638' };
      req.session = { appealReply: { state: 'SUBMITTED' } };
      getAppeal.mockResolvedValue(null);

      await alreadySubmittedController.getAlreadySubmitted(req, res);

      expect(getAppeal).toHaveBeenCalledWith(req.params.id);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalled();
    });

    it('should call the correct template', async () => {
      req.params = { id: '6546a75e-6e8b-4c47-ad53-c4ed7e634638' };
      req.session = { appealReply: { state: 'SUBMITTED', submissionDate: new Date() } };
      getAppeal.mockResolvedValue({ horizonId: '1234' });

      await alreadySubmittedController.getAlreadySubmitted(req, res);

      expect(res.render).toHaveBeenCalledWith(VIEW.ALREADY_SUBMITTED, {
        backLink: undefined,
        horizonId: '1234',
        submissionDate: moment(req.session.appealReply.submissionDate).format('D MMMM YYYY'),
      });
    });
  });
});
