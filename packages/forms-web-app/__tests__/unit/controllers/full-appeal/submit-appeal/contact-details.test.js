const { createOrUpdateAppeal } = require('../../../../../src/lib/appeals-api-wrapper');
const contactDetailsController = require('../../../../../src/controllers/full-appeal/submit-appeal/contact-details');
const { mockReq, mockRes } = require('../../../mocks');
const {
  VIEW: {
    FULL_APPEAL: { CONTACT_DETAILS, TASK_LIST },
  },
} = require('../../../../../src/lib/full-appeal/views');
const logger = require('../../../../../src/lib/logger');
const { APPEAL_DOCUMENT } = require('../../../../../src/lib/empty-appeal');
const TASK_STATUS = require('../../../../../src/services/task-status/task-statuses');

jest.mock('../../../../../src/lib/appeals-api-wrapper');
jest.mock('../../../../../src/services/task.service');
jest.mock('../../../../../src/lib/empty-appeal');
jest.mock('../../../../../src/lib/logger');

const sectionName = 'contactDetailsSection';

describe('controllers/full-appeal/submit-appeal/contact-details', () => {
  let req;
  let res;
  let appeal;

  beforeEach(() => {
    req = mockReq();
    res = mockRes();

    ({ empty: appeal } = APPEAL_DOCUMENT);

    jest.resetAllMocks();
  });

  describe('getContactDetails', () => {
    it('should call the correct template', () => {
      contactDetailsController.getContactDetails(req, res);

      expect(res.render).toHaveBeenCalledWith(CONTACT_DETAILS, {
        appeal: req.session.appeal,
      });
    });
  });

  describe('postContactDetails', () => {
    it('should re-render the template with errors if submission validation fails', async () => {
      const mockRequest = {
        ...req,
        body: {
          errors: { a: 'b' },
          errorSummary: [{ text: 'There were errors here', href: '#' }],
        },
      };
      await contactDetailsController.postContactDetails(mockRequest, res);

      expect(res.redirect).not.toHaveBeenCalled();
      expect(res.render).toHaveBeenCalledWith(CONTACT_DETAILS, {
        appeal: {
          ...req.session.appeal,
          [sectionName]: {
            ...req.session.appeal[sectionName],
            name: undefined,
            companyName: undefined,
            email: undefined,
          },
        },
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

      await contactDetailsController.postContactDetails(mockRequest, res);

      expect(res.redirect).not.toHaveBeenCalled();

      expect(logger.error).toHaveBeenCalledWith(error);

      expect(res.render).toHaveBeenCalledWith(CONTACT_DETAILS, {
        appeal: req.session.appeal,
        errorSummary: [{ text: error.toString(), href: '#' }],
        errors: {},
      });
    });

    it('should redirect to task list if valid and original appellant', async () => {
      const mockRequest = {
        ...req,
        body: {},
        session: {
          appeal: {
            ...appeal,
            [sectionName]: {
              ...appeal[sectionName],
              name: undefined,
              companyName: undefined,
              email: undefined,
            },
            sectionStates: {
              ...appeal.sectionStates,
              [sectionName]: appeal.sectionStates[sectionName],
            },
          },
        },
      };

      await contactDetailsController.postContactDetails(mockRequest, res);

      expect(createOrUpdateAppeal).toHaveBeenCalledWith({
        ...appeal,
        [sectionName]: {
          ...appeal[sectionName],
          name: undefined,
          companyName: undefined,
          email: undefined,
        },
        sectionStates: {
          ...appeal.sectionStates,
          [sectionName]: TASK_STATUS.COMPLETED,
        },
      });

      expect(res.redirect).toHaveBeenCalledWith(`/${TASK_LIST}`);
    });
  });
});
