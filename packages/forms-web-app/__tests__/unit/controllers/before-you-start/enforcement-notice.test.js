const enforcementNoticeController = require('../../../../src/controllers/before-you-start/enforcement-notice');
const { createOrUpdateAppeal } = require('../../../../src/lib/appeals-api-wrapper');
const { VIEW } = require('../../../../src/lib/views');
const logger = require('../../../../src/lib/logger');
const { APPEAL_DOCUMENT } = require('../../../../src/lib/empty-appeal');
const { mockReq, mockRes } = require('../../mocks');

jest.mock('../../../../src/lib/appeals-api-wrapper');
jest.mock('../../../../src/lib/logger');

describe('controllers/before-you-start/enforcement-notice', () => {
  let req;
  let res;
  let appeal;

  beforeEach(() => {
    req = mockReq();
    res = mockRes();

    ({ empty: appeal } = APPEAL_DOCUMENT);

    jest.resetAllMocks();
  });

  describe('getEnforcementNotice', () => {
    it('should call the correct template', () => {
      enforcementNoticeController.getEnforcementNotice(req, res);

      expect(res.render).toHaveBeenCalledWith(VIEW.BEFORE_YOU_START.ENFORCEMENT_NOTICE, {
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
      expect(res.render).toHaveBeenCalledWith(VIEW.BEFORE_YOU_START.ENFORCEMENT_NOTICE, {
        appeal: {
          ...req.session.appeal,
          beforeYouStart: {
            ...req.session.appeal.beforeYouStart,
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

      expect(res.render).toHaveBeenCalledWith(VIEW.BEFORE_YOU_START.ENFORCEMENT_NOTICE, {
        appeal: req.session.appeal,
        errors: {},
        errorSummary: [{ text: error.toString(), href: '#' }],
      });
    });

    it('should redirect to `/before-you-start/use-a-different-service` if `enforcement-notice` is `yes`', async () => {
      const mockRequest = {
        ...req,
        body: {
          'enforcement-notice': 'yes',
        },
      };
      await enforcementNoticeController.postEnforcementNotice(mockRequest, res);

      expect(createOrUpdateAppeal).toHaveBeenCalledWith({
        ...appeal,
        beforeYouStart: {
          ...appeal.beforeYouStart,
          enforcementNotice: true,
        },
      });

      expect(res.redirect).toHaveBeenCalledWith(
        `/${VIEW.BEFORE_YOU_START.USE_A_DIFFERENT_SERVICE}`
      );
    });

    it('should redirect to `/before-you-start/granted-or-refused-permission` if `enforcement-notice` is `no`', async () => {
      const mockRequest = {
        ...req,
        body: {
          'enforcement-notice': 'no',
        },
      };
      await enforcementNoticeController.postEnforcementNotice(mockRequest, res);

      expect(createOrUpdateAppeal).toHaveBeenCalledWith({
        ...appeal,
        beforeYouStart: {
          ...appeal.beforeYouStart,
          enforcementNotice: false,
        },
      });

      expect(res.redirect).toHaveBeenCalledWith(
        `/${VIEW.BEFORE_YOU_START.GRANTED_REFUSED_PERMISSION}`
      );
    });
  });
});
