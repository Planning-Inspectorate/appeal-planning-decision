const appeal = require('@pins/business-rules/test/data/householder-appeal');
const enforcementNoticeController = require('../../../../src/controllers/eligibility/enforcement-notice');
const { createOrUpdateAppeal } = require('../../../../src/lib/appeals-api-wrapper');
const { VIEW } = require('../../../../src/lib/views');
const logger = require('../../../../src/lib/logger');
const { mockReq, mockRes } = require('../../mocks');

jest.mock('../../../../src/lib/appeals-api-wrapper');
jest.mock('../../../../src/lib/logger');

describe('controllers/eligibility/enforcement-notice', () => {
  let req;
  let res;

  beforeEach(() => {
    req = mockReq(appeal);
    res = mockRes();

    jest.resetAllMocks();
  });

  describe('getServiceNotAvailableWhenReceivedEnforcementNotice', () => {
    it('calls the correct template', () => {
      enforcementNoticeController.getServiceNotAvailableWhenReceivedEnforcementNotice(req, res);

      expect(res.render).toHaveBeenCalledWith(VIEW.ELIGIBILITY.ENFORCEMENT_NOTICE_OUT);
    });
  });

  describe('getEnforcementNotice', () => {
    it('should call the correct template', () => {
      enforcementNoticeController.getEnforcementNotice(req, res);

      expect(res.render).toHaveBeenCalledWith(VIEW.ELIGIBILITY.ENFORCEMENT_NOTICE, {
        appeal: req.session.appeal,
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
      expect(res.render).toHaveBeenCalledWith(VIEW.ELIGIBILITY.ENFORCEMENT_NOTICE, {
        appeal: {
          ...req.session.appeal,
          eligibility: {
            ...req.session.appeal.eligibility,
            enforcementNotice: null,
          },
        },
        errorSummary: [{ text: 'There were errors here', href: '#' }],
        errors: { a: 'b' },
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

      expect(res.render).toHaveBeenCalledWith(VIEW.ELIGIBILITY.ENFORCEMENT_NOTICE, {
        appeal: req.session.appeal,
        errors: {},
        errorSummary: [{ text: error.toString(), href: '#' }],
      });
    });

    it('should redirect to `/eligibility/enforcement-notice-out` if `enforcement-notice` is `yes`', async () => {
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

      expect(res.redirect).toHaveBeenCalledWith(`/${VIEW.ELIGIBILITY.ENFORCEMENT_NOTICE_OUT}`);
    });

    it('should redirect to `/eligibility/listed-building` if `enforcement-notice` is `no`', async () => {
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

      expect(res.redirect).toHaveBeenCalledWith(`/${VIEW.ELIGIBILITY.LISTED_BUILDING}`);
    });
  });
});
