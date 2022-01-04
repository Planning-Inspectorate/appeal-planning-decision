const enforcementNoticeController = require('../../../../src/controllers/full-appeal/enforcement-notice');
const { createOrUpdateAppeal } = require('../../../../src/lib/appeals-api-wrapper');
const {
  VIEW: {
    FULL_APPEAL: { ENFORCEMENT_NOTICE: currentPage },
  },
} = require('../../../../src/lib/views');
const getPreviousPagePath = require('../../../../src/lib/get-previous-page-path');

const navigationPages = {
  nextPage: '/before-you-start/claiming-costs',
  shutterPage: '/before-you-start/use-a-different-service',
  previousPage: '/before-you-start/decision-date',
};
const logger = require('../../../../src/lib/logger');
const { APPEAL_DOCUMENT } = require('../../../../src/lib/empty-appeal');
const { mockReq, mockRes } = require('../../mocks');

jest.mock('../../../../src/lib/appeals-api-wrapper');
jest.mock('../../../../src/lib/logger');
jest.mock('../../../../src/lib/get-previous-page-path');

describe('controllers/full-appeal/enforcement-notice', () => {
  let req;
  let res;
  let appeal;

  beforeEach(() => {
    req = mockReq();
    res = mockRes();

    ({ empty: appeal } = APPEAL_DOCUMENT);

    getPreviousPagePath.mockImplementation(() => {
      return '/before-you-start/decision-date';
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('getEnforcementNotice', () => {
    it('should call the correct template', () => {
      enforcementNoticeController.getEnforcementNotice(req, res);

      expect(res.render).toHaveBeenCalledWith(currentPage, {
        appeal: req.session.appeal,
        previousPage: navigationPages.previousPage,
      });
    });
  });

  describe('postEnforcementNotice', () => {
    it('should re-render the template with errors if there is any validation error', async () => {
      const mockRequest = {
        ...req,
        body: {
          'enforcement-notice': 'bad value',
          errors: { a: 'b' },
          errorSummary: [{ text: 'There were errors here', href: '#' }],
        },
      };
      await enforcementNoticeController.postEnforcementNotice(mockRequest, res);

      expect(createOrUpdateAppeal).not.toHaveBeenCalled();

      expect(res.redirect).not.toHaveBeenCalled();
      expect(res.render).toHaveBeenCalledWith(currentPage, {
        appeal: {
          ...req.session.appeal,
          eligibility: {
            ...req.session.appeal.eligibility,
            enforcementNotice: null,
          },
        },
        errorSummary: [{ text: 'There were errors here', href: '#' }],
        errors: { a: 'b' },
        previousPage: navigationPages.previousPage,
      });
    });

    it('should re-render the template with errors if there is any api call error', async () => {
      const mockRequest = {
        ...req,
        body: {},
      };

      const error = new Error('Cheers');
      createOrUpdateAppeal.mockImplementation(() => Promise.reject(error));

      await enforcementNoticeController.postEnforcementNotice(mockRequest, res);

      expect(res.redirect).not.toHaveBeenCalled();

      expect(logger.error).toHaveBeenCalledWith(error);

      expect(res.render).toHaveBeenCalledWith(currentPage, {
        appeal: req.session.appeal,
        errors: {},
        errorSummary: [{ text: error.toString(), href: '#' }],
        previousPage: navigationPages.previousPage,
      });
    });

    it('should redirect to `/full-appeal/use-a-different-service` if `enforcement-notice` is `yes`', async () => {
      const mockRequest = {
        ...req,
        body: {
          'enforcement-notice': 'yes',
        },
      };
      await enforcementNoticeController.postEnforcementNotice(mockRequest, res);

      expect(createOrUpdateAppeal).toHaveBeenCalledWith({
        ...appeal,
        eligibility: {
          ...appeal.eligibility,
          enforcementNotice: true,
        },
      });

      expect(res.redirect).toHaveBeenCalledWith(navigationPages.shutterPage);
    });

    it('should redirect to `/full-appeal/granted-or-refused` if `enforcement-notice` is `no`', async () => {
      const mockRequest = {
        ...req,
        body: {
          'enforcement-notice': 'no',
        },
      };
      await enforcementNoticeController.postEnforcementNotice(mockRequest, res);

      expect(createOrUpdateAppeal).toHaveBeenCalledWith({
        ...appeal,
        eligibility: {
          ...appeal.eligibility,
          enforcementNotice: false,
        },
      });

      expect(res.redirect).toHaveBeenCalledWith(navigationPages.nextPage);
    });
  });
});
