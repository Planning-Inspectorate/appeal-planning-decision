const fs = require('fs');
const path = require('path');
const submissionInformationController = require('../../../../src/controllers/appellant-submission/submission-information');
const { mockReq, mockRes } = require('../../mocks');
const { VIEW } = require('../../../../src/lib/views');

jest.mock('../../../../src/services/department.service');
jest.mock('../../../../src/lib/logger');

describe('controllers/appellant-submission/submission-information', () => {
  let req;
  let res;

  beforeEach(() => {
    req = mockReq(null);
    res = mockRes();

    jest.resetAllMocks();
  });

  describe('getSubmissionInformation', () => {
    it('should return 404 if appeal not found', async () => {
      await submissionInformationController.getSubmissionInformation(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.render).toHaveBeenCalledWith('error/not-found');
    });

    it('should return 400 if the LPD is not found for the given LPA', async () => {
      req = {
        ...req,
        session: {
          appeal: {},
        },
      };

      await submissionInformationController.getSubmissionInformation(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.render).toHaveBeenCalledWith('error/400', {
        message: 'Unable to locate the Local Planning Department for the given LPA Code.',
      });
    });

    it('should call the correct template with the expected data on the happy path', async () => {
      const fakeLpdName = 'fake lpd name here';

      req = {
        ...req,
        session: {
          appeal: {
            some: 'data',
            lpaCode: '123-abc',
          },
          appealLPD: {
            name: fakeLpdName,
          },
        },
      };

      await submissionInformationController.getSubmissionInformation(req, res);

      const css = fs.readFileSync(
        path.resolve(__dirname, '../../../../src/public/stylesheets/main.css'),
        'utf8'
      );

      expect(res.render).toHaveBeenCalledWith(VIEW.APPELLANT_SUBMISSION.SUBMISSION_INFORMATION, {
        appealLPD: fakeLpdName,
        appeal: req.session.appeal,
        css,
      });
    });
  });
});
