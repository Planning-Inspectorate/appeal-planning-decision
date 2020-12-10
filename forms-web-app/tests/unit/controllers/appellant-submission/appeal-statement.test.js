const appealStatementController = require('../../../../src/controllers/appellant-submission/appeal-statement');
const { mockReq, mockRes } = require('../../mocks');
const { createOrUpdateAppeal } = require('../../../../src/lib/appeals-api-wrapper');
const { getNextUncompletedTask } = require('../../../../src/services/task.service');
const logger = require('../../../../src/lib/logger');
const { APPEAL_DOCUMENT } = require('../../../../src/lib/empty-appeal');

const { VIEW } = require('../../../../src/lib/views');

jest.mock('../../../../src/lib/appeals-api-wrapper');
jest.mock('../../../../src/services/task.service');
jest.mock('../../../../src/lib/logger');

const req = mockReq();
const res = mockRes();

const sectionName = 'yourAppealSection';
const taskName = 'appealStatement';

describe('controller/appellant-submission/appeal-statement', () => {
  describe('getAppealStatement', () => {
    it('should call the correct template', () => {
      appealStatementController.getAppealStatement(req, res);

      expect(res.render).toHaveBeenCalledWith(VIEW.APPELLANT_SUBMISSION.APPEAL_STATEMENT, {
        appeal: req.session.appeal,
      });
    });
  });

  describe('postAppealStatement', () => {
    it('should re-render the template with errors if submission validation fails', async () => {
      const mockRequest = {
        ...req,
        body: {
          errors: { a: 'b' },
          errorSummary: [{ text: 'There were errors here', href: '#' }],
        },
        files: {
          'appeal-upload': {},
        },
      };
      await appealStatementController.postAppealStatement(mockRequest, res);

      expect(res.redirect).not.toHaveBeenCalled();
      expect(res.render).toHaveBeenCalledWith(VIEW.APPELLANT_SUBMISSION.APPEAL_STATEMENT, {
        appeal: req.session.appeal,
        errors: { a: 'b' },
        errorSummary: [{ text: 'There were errors here', href: '#' }],
      });
    });

    it('should redirect back to `/appellant-submission/appeal-statement` if validation passes but `i-confirm` not given', async () => {
      const mockRequest = {
        ...req,
        body: {
          'does-not-include-sensitive-information': 'anything here - not valid',
        },
        files: {
          'appeal-upload': {},
        },
      };
      appealStatementController.postAppealStatement(mockRequest, res);

      expect(res.redirect).toHaveBeenCalledWith('/appellant-submission/appeal-statement');
    });

    it('should log an error if the api call fails, and remain on the same page', async () => {
      const error = new Error('API is down');
      createOrUpdateAppeal.mockImplementation(() => Promise.reject(error));
      const mockRequest = {
        ...req,
        body: {
          'does-not-include-sensitive-information': 'i-confirm',
        },
        files: {},
      };
      await appealStatementController.postAppealStatement(mockRequest, res);

      expect(res.redirect).not.toHaveBeenCalled();
      expect(logger.error).toHaveBeenCalledWith(error);
      expect(res.render).toHaveBeenCalledWith(VIEW.APPELLANT_SUBMISSION.APPEAL_STATEMENT, {
        appeal: req.session.appeal,
        errors: {},
        errorSummary: [{ text: error.toString(), href: '#' }],
      });
    });

    it('should redirect to `/appellant-submission/supporting-documents` if valid', async () => {
      createOrUpdateAppeal.mockImplementation(() => JSON.stringify({ good: 'data' }));
      getNextUncompletedTask.mockReturnValue({
        href: `/${VIEW.APPELLANT_SUBMISSION.SUPPORTING_DOCUMENTS}`,
      });

      const mockRequest = {
        ...req,
        body: {
          'does-not-include-sensitive-information': 'i-confirm',
        },
        files: {
          'appeal-upload': {
            name: 'some name.jpg',
          },
        },
      };
      await appealStatementController.postAppealStatement(mockRequest, res);

      const { empty: goodAppeal } = APPEAL_DOCUMENT;
      goodAppeal[sectionName][taskName].uploadedFile = { name: 'some name.jpg' };
      goodAppeal[sectionName][taskName].hasSensitiveInformation = false;
      goodAppeal.sectionStates[sectionName][taskName] = 'COMPLETED';

      expect(res.redirect).toHaveBeenCalledWith(
        `/${VIEW.APPELLANT_SUBMISSION.SUPPORTING_DOCUMENTS}`
      );

      expect(createOrUpdateAppeal).toHaveBeenCalledWith(goodAppeal);
    });
  });
});
