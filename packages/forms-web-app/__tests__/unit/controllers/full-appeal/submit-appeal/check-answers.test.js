const appeal = require('@pins/business-rules/test/data/full-appeal');
const checkAnswersController = require('../../../../../src/controllers/full-appeal/submit-appeal/check-answers');
const { getDepartmentFromId } = require('../../../../../src/services/department.service');
const { mockReq, mockRes } = require('../../../mocks');
const { VIEW } = require('../../../../../src/lib/full-appeal/views');

jest.mock('../../../../../src/services/department.service');

describe('controllers/full-appeal/submit-appeal/check-answers', () => {
  let req;
  let res;

  beforeEach(() => {
    req = mockReq(appeal);
    res = mockRes();

    jest.resetAllMocks();
  });

  describe('getCheckAnswers', () => {
    it('should call the correct template with empty local planning department', () => {
      req.session.appeal.lpaCode = null;
      checkAnswersController.getCheckAnswers(req, res);
      expect(res.render).toHaveBeenCalledWith(VIEW.FULL_APPEAL.CHECK_ANSWERS, {
        appealLPD: '',
        appeal,
      });
    });
    it('should call the correct template with empty local planning department', async () => {
      await getDepartmentFromId.mockResolvedValue(undefined);

      appeal.lpaCode = 'lpdCode';
      await checkAnswersController.getCheckAnswers(req, res);

      expect(res.render).toHaveBeenCalledWith(VIEW.FULL_APPEAL.CHECK_ANSWERS, {
        appealLPD: '',
        appeal,
      });
    });
    it('should call the correct template with local planning department name', async () => {
      await getDepartmentFromId.mockResolvedValue({ name: 'lpdName' });

      appeal.lpaCode = 'lpdCode';
      await checkAnswersController.getCheckAnswers(req, res);

      expect(res.render).toHaveBeenCalledWith(VIEW.FULL_APPEAL.CHECK_ANSWERS, {
        appealLPD: 'lpdName',
        appeal,
      });
    });
  });
});
