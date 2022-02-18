const appeal = require('@pins/business-rules/test/data/householder-appeal');
const checkAnswersController = require('../../../../src/controllers/appellant-submission/check-answers');
const { getDepartmentFromId } = require('../../../../src/services/department.service');
const { mockReq, mockRes } = require('../../mocks');
const { VIEW } = require('../../../../src/lib/views');

jest.mock('../../../../src/services/department.service');

describe('controllers/appellant-submission/check-answers', () => {
  let req;
  let res;

  beforeEach(() => {
    req = mockReq(appeal);
    res = mockRes();

    jest.resetAllMocks();
  });

  describe('getCheckAnswers', () => {
    it('should call the correct template with empty local planning department', () => {
      delete req.session.appeal.lpaCode;
      checkAnswersController.getCheckAnswers(req, res);
      expect(res.render).toHaveBeenCalledWith(VIEW.APPELLANT_SUBMISSION.CHECK_ANSWERS, {
        appealLPD: '',
        appeal,
      });
    });
    it('should call the correct template with empty local planning department', async () => {
      await getDepartmentFromId.mockResolvedValue(undefined);

      appeal.lpaCode = 'lpdCode';
      await checkAnswersController.getCheckAnswers(req, res);

      expect(res.render).toHaveBeenCalledWith(VIEW.APPELLANT_SUBMISSION.CHECK_ANSWERS, {
        appealLPD: '',
        appeal,
      });
    });
    it('should call the correct template with local planning department name', async () => {
      await getDepartmentFromId.mockResolvedValue({ name: 'lpdName' });

      appeal.lpaCode = 'lpdCode';
      await checkAnswersController.getCheckAnswers(req, res);

      expect(res.render).toHaveBeenCalledWith(VIEW.APPELLANT_SUBMISSION.CHECK_ANSWERS, {
        appealLPD: 'lpdName',
        appeal,
      });
    });
  });
});
