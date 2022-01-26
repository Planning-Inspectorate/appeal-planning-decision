const {
  getOtherTenants,
  postOtherTenants,
} = require('../../../../../src/controllers/full-appeal/submit-appeal/other-tenants');
const { createOrUpdateAppeal } = require('../../../../../src/lib/appeals-api-wrapper');
const { getTaskStatus } = require('../../../../../src/services/task.service');
const { APPEAL_DOCUMENT } = require('../../../../../src/lib/empty-appeal');
const { mockReq, mockRes } = require('../../../mocks');
const {
  VIEW: {
    FULL_APPEAL: { OTHER_TENANTS, TELLING_THE_TENANTS, VISIBLE_FROM_ROAD },
  },
} = require('../../../../../src/lib/full-appeal/views');

jest.mock('../../../../../src/lib/appeals-api-wrapper');
jest.mock('../../../../../src/services/task.service');

describe('controllers/full-appeal/submit-appeal/other-tenants', () => {
  let req;
  let res;
  let appeal;

  const sectionName = 'appealSiteSection';
  const taskName = 'areOtherTenants';
  const appealId = 'da368e66-de7b-44c4-a403-36e5bf5b000b';
  const errors = { 'other-tenants': 'Select an option' };
  const errorSummary = [{ text: 'There was an error', href: '#' }];

  beforeEach(() => {
    appeal = {
      ...APPEAL_DOCUMENT.empty,
      id: appealId,
      appealSiteSection: {
        areOtherTenants: false,
      },
    };
    req = {
      ...mockReq(),
      body: {},
      session: {
        appeal,
      },
    };
    res = mockRes();

    jest.resetAllMocks();
  });

  describe('getOtherTenants', () => {
    it('should call the correct template', () => {
      getOtherTenants(req, res);

      expect(res.render).toHaveBeenCalledTimes(1);
      expect(res.render).toHaveBeenCalledWith(OTHER_TENANTS, {
        areOtherTenants: false,
      });
    });

    it('should call the correct template when appeal.appealSiteSection is not defined', () => {
      delete appeal.appealSiteSection;

      getOtherTenants(req, res);

      expect(res.render).toHaveBeenCalledTimes(1);
      expect(res.render).toHaveBeenCalledWith(OTHER_TENANTS, {
        areOtherTenants: undefined,
      });
    });
  });

  describe('postOtherTenants', () => {
    it('should re-render the template with errors if submission validation fails', async () => {
      req = {
        ...req,
        body: {
          'other-tenants': undefined,
          errors,
          errorSummary,
        },
      };

      await postOtherTenants(req, res);

      expect(res.redirect).not.toHaveBeenCalled();
      expect(res.render).toHaveBeenCalledTimes(1);
      expect(res.render).toHaveBeenCalledWith(OTHER_TENANTS, {
        errors,
        errorSummary,
      });
    });

    it('should re-render the template with errors if an error is thrown', async () => {
      const error = new Error('Internal Server Error');

      createOrUpdateAppeal.mockImplementation(() => {
        throw error;
      });

      await postOtherTenants(req, res);

      expect(res.redirect).not.toHaveBeenCalled();
      expect(res.render).toHaveBeenCalledTimes(1);
      expect(res.render).toHaveBeenCalledWith(OTHER_TENANTS, {
        areOtherTenants: false,
        errors: {},
        errorSummary: [{ text: error.toString(), href: '#' }],
      });
    });

    it('should redirect to the correct page if `yes` has been selected', async () => {
      const submittedAppeal = {
        ...appeal,
        state: 'SUBMITTED',
      };

      createOrUpdateAppeal.mockReturnValue(submittedAppeal);

      req = {
        ...req,
        body: {
          'other-tenants': 'yes',
        },
      };

      await postOtherTenants(req, res);

      expect(getTaskStatus).toHaveBeenCalledWith(appeal, sectionName, taskName);
      expect(createOrUpdateAppeal).toHaveBeenCalledWith(appeal);
      expect(res.redirect).toHaveBeenCalledWith(`/${TELLING_THE_TENANTS}`);
      expect(req.session.appeal).toEqual(submittedAppeal);
    });

    it('should redirect to the correct page if `no` has been selected', async () => {
      const submittedAppeal = {
        ...appeal,
        state: 'SUBMITTED',
      };

      createOrUpdateAppeal.mockReturnValue(submittedAppeal);

      req = {
        ...req,
        body: {
          'other-tenants': 'no',
        },
      };

      await postOtherTenants(req, res);

      expect(getTaskStatus).toHaveBeenCalledWith(appeal, sectionName, taskName);
      expect(createOrUpdateAppeal).toHaveBeenCalledWith(appeal);
      expect(res.redirect).toHaveBeenCalledWith(`/${VISIBLE_FROM_ROAD}`);
      expect(req.session.appeal).toEqual(submittedAppeal);
    });

    it('should redirect to the correct page if `yes` has been selected and appeal.appealSiteSection is not defined', async () => {
      const submittedAppeal = {
        ...appeal,
        state: 'SUBMITTED',
      };

      delete appeal.appealSiteSection;

      createOrUpdateAppeal.mockReturnValue(submittedAppeal);

      req = {
        ...req,
        body: {
          'other-tenants': 'yes',
        },
      };

      await postOtherTenants(req, res);

      expect(getTaskStatus).toHaveBeenCalledWith(appeal, sectionName, taskName);
      expect(createOrUpdateAppeal).toHaveBeenCalledWith(appeal);
      expect(res.redirect).toHaveBeenCalledWith(`/${TELLING_THE_TENANTS}`);
      expect(req.session.appeal).toEqual(submittedAppeal);
    });

    it('should redirect to the correct page if `no` has been selected and appeal.appealSiteSection is not defined', async () => {
      const submittedAppeal = {
        ...appeal,
        state: 'SUBMITTED',
      };

      delete appeal.appealSiteSection;

      createOrUpdateAppeal.mockReturnValue(submittedAppeal);

      req = {
        ...req,
        body: {
          'other-tenants': 'no',
        },
      };

      await postOtherTenants(req, res);

      expect(getTaskStatus).toHaveBeenCalledWith(appeal, sectionName, taskName);
      expect(createOrUpdateAppeal).toHaveBeenCalledWith(appeal);
      expect(res.redirect).toHaveBeenCalledWith(`/${VISIBLE_FROM_ROAD}`);
      expect(req.session.appeal).toEqual(submittedAppeal);
    });

    it('should redirect to the correct page if `yes` has been selected and appeal.sectionStates.appealSiteSection is not defined', async () => {
      const submittedAppeal = {
        ...appeal,
        state: 'SUBMITTED',
      };

      delete appeal.sectionStates.appealSiteSection;

      createOrUpdateAppeal.mockReturnValue(submittedAppeal);

      req = {
        ...req,
        body: {
          'other-tenants': 'yes',
        },
      };

      await postOtherTenants(req, res);

      expect(getTaskStatus).toHaveBeenCalledWith(appeal, sectionName, taskName);
      expect(createOrUpdateAppeal).toHaveBeenCalledWith(appeal);
      expect(res.redirect).toHaveBeenCalledWith(`/${TELLING_THE_TENANTS}`);
      expect(req.session.appeal).toEqual(submittedAppeal);
    });

    it('should redirect to the correct page if `no` has been selected and appeal.sectionStates.appealSiteSection is not defined', async () => {
      const submittedAppeal = {
        ...appeal,
        state: 'SUBMITTED',
      };

      delete appeal.sectionStates.appealSiteSection;

      createOrUpdateAppeal.mockReturnValue(submittedAppeal);

      req = {
        ...req,
        body: {
          'other-tenants': 'no',
        },
      };

      await postOtherTenants(req, res);

      expect(getTaskStatus).toHaveBeenCalledWith(appeal, sectionName, taskName);
      expect(createOrUpdateAppeal).toHaveBeenCalledWith(appeal);
      expect(res.redirect).toHaveBeenCalledWith(`/${VISIBLE_FROM_ROAD}`);
      expect(req.session.appeal).toEqual(submittedAppeal);
    });
  });
});
