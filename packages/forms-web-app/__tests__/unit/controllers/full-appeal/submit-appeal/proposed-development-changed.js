const appeal = require('@pins/business-rules/test/data/full-appeal');
const proposedDevelopmentController = require('../../../../../src/controllers/full-appeal/submit-appeal/proposed-development-changed');
const { mockReq, mockRes } = require('../../../mocks');
const { createOrUpdateAppeal } = require('../../../../../src/lib/appeals-api-wrapper');
const logger = require('../../../../../src/lib/logger');
const {
  VIEW: {
    FULL_APPEAL: { PROPOSED_DEVELOPMENT_CHANGED, PLANS_DRAWINGS_DOCUMENTS },
  },
} = require('../../../../../src/lib/full-appeal/views');

jest.mock('../../../../../src/lib/appeals-api-wrapper');
jest.mock('../../../../../src/services/task.service');
jest.mock('../../../../../src/lib/logger');

const sectionName = 'planningApplicationDocumentsSection';
const taskName = 'proposedDevelopmentChanged';
const proposedDevelopmentChanged = {
  isDescriptionOfDevelopmentCorrect: true,
  details: 'some details',
};

describe('controllers/full-appeal/submit-appeal/proposed-development-changed', () => {
  let req;
  let res;

  beforeEach(() => {
    req = mockReq(appeal);
    res = mockRes();

    appeal.planningApplicationDocumentsSection.proposedDevelopmentChanged =
      proposedDevelopmentChanged;

    jest.resetAllMocks();
  });

  describe('getProposedDevelopmentChanged', () => {
    it('should call the correct template', () => {
      proposedDevelopmentController.postProposedDevelopmentChanged(req, res);
      expect(res.render).toHaveBeenCalledWith(PROPOSED_DEVELOPMENT_CHANGED, {
        proposedDevelopmentChanged,
      });
    });
  });

  describe('postProposedDevelopmentChanged', () => {
    it('should re-render the template with errors if submission validation fails', async () => {
      const mockRequest = {
        ...req,
        body: {
          errors: { a: 'b' },
          errorSummary: [{ text: 'There were errors here', href: '#' }],
        },
      };
      await proposedDevelopmentController.postProposedDevelopmentChanged(mockRequest, res);

      expect(res.redirect).not.toHaveBeenCalled();
      expect(res.render).toHaveBeenCalledWith(PROPOSED_DEVELOPMENT_CHANGED, {
        proposedDevelopmentChanged,
        errorSummary: [{ text: 'There were errors here', href: '#' }],
        errors: { a: 'b' },
      });
    });

    it('should log an error if the api call fails, and remain on the same page', async () => {
      const error = new Error('API is down');

      createOrUpdateAppeal.mockImplementation(() => Promise.reject(error));
      const mockRequest = {
        ...req,
        body: {},
      };
      await proposedDevelopmentController.postProposedDevelopmentChanged(mockRequest, res);

      expect(logger.error).toHaveBeenCalledWith(error);

      expect(res.redirect).not.toHaveBeenCalled();

      expect(res.render).toHaveBeenCalledWith(PROPOSED_DEVELOPMENT_CHANGED, {
        proposedDevelopmentChanged,
        errors: {},
        errorSummary: [{ text: error.toString(), href: '#' }],
      });
    });

    it('should redirect to `/full-appeal/plans-drawings-documents` if valid', async () => {
      const fakeTaskStatus = 'COMPLETED';

      const mockRequest = {
        ...req,
        body: {
          'description-development-correct': proposedDevelopmentChanged,
        },
      };

      await proposedDevelopmentController.postProposedDevelopmentChanged(mockRequest, res);

      expect(createOrUpdateAppeal).toHaveBeenCalledWith({
        ...appeal,
        [sectionName]: {
          ...appeal[sectionName],
          [taskName]: taskName,
        },
        sectionStates: {
          ...appeal.sectionStates,
          [sectionName]: {
            ...appeal.sectionStates[sectionName],
            [taskName]: fakeTaskStatus,
          },
        },
      });

      expect(res.redirect).toHaveBeenCalledWith(`/${PLANS_DRAWINGS_DOCUMENTS}`);
    });
  });
});
