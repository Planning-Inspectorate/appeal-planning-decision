const {
  constants: { APPEAL_ID },
  models,
} = require('@pins/business-rules');
const {
  getKnowTheOwners,
  postKnowTheOwners,
} = require('../../../../../src/controllers/full-appeal/submit-appeal/know-the-owners');
const { createOrUpdateAppeal } = require('../../../../../src/lib/appeals-api-wrapper');
const { getTaskStatus } = require('../../../../../src/services/task.service');
const { mockReq, mockRes } = require('../../../mocks');
const {
  VIEW: {
    FULL_APPEAL: { IDENTIFYING_THE_OWNERS, KNOW_THE_OWNERS, TELLING_THE_LANDOWNERS },
  },
} = require('../../../../../src/lib/full-appeal/views');

jest.mock('../../../../../src/lib/appeals-api-wrapper');
jest.mock('../../../../../src/services/task.service');

describe('controllers/full-appeal/submit-appeal/know-the-owners', () => {
  let req;
  let res;
  let appeal;

  const sectionName = 'appealSiteSection';
  const taskName = 'siteOwnership';
  const appealId = 'da368e66-de7b-44c4-a403-36e5bf5b000b';
  const errors = { 'know-the-owners': 'Select an option' };
  const errorSummary = [{ text: 'There was an error', href: '#' }];
  const model = models.getModel(APPEAL_ID.PLANNING_SECTION_78);

  beforeEach(() => {
    appeal = {
      ...model,
      id: appealId,
      appealSiteSection: {
        siteOwnership: {
          ownsSomeOfTheLand: true,
          knowsTheOwners: 'yes',
        },
      },
    };
    req = {
      ...mockReq(appeal),
      body: {},
    };
    res = mockRes();

    jest.resetAllMocks();
  });

  describe('getKnowTheOwners', () => {
    it('should call the correct template', () => {
      getKnowTheOwners(req, res);

      expect(res.render).toHaveBeenCalledTimes(1);
      expect(res.render).toHaveBeenCalledWith(KNOW_THE_OWNERS, {
        ownsSomeOfTheLand: true,
        knowsTheOwners: 'yes',
      });
    });

    it('should call the correct template when appeal.appealSiteSection is not defined', () => {
      delete appeal.appealSiteSection;

      getKnowTheOwners(req, res);

      expect(res.render).toHaveBeenCalledTimes(1);
      expect(res.render).toHaveBeenCalledWith(KNOW_THE_OWNERS, {
        ownsSomeOfTheLand: undefined,
        knowsTheOwners: undefined,
      });
    });
  });

  describe('postKnowTheOwners', () => {
    it('should re-render the template with errors if submission validation fails', async () => {
      req = {
        ...req,
        body: {
          'know-the-owners': undefined,
          errors,
          errorSummary,
        },
      };

      await postKnowTheOwners(req, res);

      expect(res.redirect).not.toHaveBeenCalled();
      expect(res.render).toHaveBeenCalledTimes(1);
      expect(res.render).toHaveBeenCalledWith(KNOW_THE_OWNERS, {
        ownsSomeOfTheLand: true,
        errors,
        errorSummary,
      });
    });

    it('should re-render the template with errors if an error is thrown', async () => {
      req = {
        ...req,
        body: {
          'know-the-owners': 'yes',
        },
      };

      const error = new Error('Internal Server Error');

      createOrUpdateAppeal.mockImplementation(() => {
        throw error;
      });

      await postKnowTheOwners(req, res);

      expect(res.redirect).not.toHaveBeenCalled();
      expect(res.render).toHaveBeenCalledTimes(1);
      expect(res.render).toHaveBeenCalledWith(KNOW_THE_OWNERS, {
        ownsSomeOfTheLand: true,
        knowsTheOwners: 'yes',
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
          'know-the-owners': 'yes',
        },
      };

      await postKnowTheOwners(req, res);

      expect(getTaskStatus).toHaveBeenCalledWith(appeal, sectionName, taskName);
      expect(createOrUpdateAppeal).toHaveBeenCalledWith(appeal);
      expect(res.redirect).toHaveBeenCalledWith(`/${TELLING_THE_LANDOWNERS}`);
      expect(req.session.appeal).toEqual(submittedAppeal);
    });

    it('should redirect to the correct page if `some` has been selected', async () => {
      const submittedAppeal = {
        ...appeal,
        state: 'SUBMITTED',
      };

      createOrUpdateAppeal.mockReturnValue(submittedAppeal);

      req = {
        ...req,
        body: {
          'know-the-owners': 'some',
        },
      };

      await postKnowTheOwners(req, res);

      expect(getTaskStatus).toHaveBeenCalledWith(appeal, sectionName, taskName);
      expect(createOrUpdateAppeal).toHaveBeenCalledWith(appeal);
      expect(res.redirect).toHaveBeenCalledWith(`/${IDENTIFYING_THE_OWNERS}`);
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
          'know-the-owners': 'no',
        },
      };

      await postKnowTheOwners(req, res);

      expect(getTaskStatus).toHaveBeenCalledWith(appeal, sectionName, taskName);
      expect(createOrUpdateAppeal).toHaveBeenCalledWith(appeal);
      expect(res.redirect).toHaveBeenCalledWith(`/${IDENTIFYING_THE_OWNERS}`);
      expect(req.session.appeal).toEqual(submittedAppeal);
    });

    it(`should assign null to appealSiteSection.identifyingTheOwners if appealSiteSection.knowsTheOwners and body['know-the-owners'] are different`, async () => {
      const submittedAppeal = {
        ...appeal,
        state: 'SUBMITTED',
      };

      req = {
        ...req,
        body: {
          'know-the-owners': 'no',
        },
      };
      req.session.appeal.appealSiteSection.knowsTheOwners = 'some';
      req.session.appeal.appealSiteSection.identifyingTheOwners = 'i-agree';

      createOrUpdateAppeal.mockReturnValue(submittedAppeal);

      await postKnowTheOwners(req, res);

      const expectedAppeal = {
        ...req.session.appeal,
        state: 'DRAFT',
      };
      expectedAppeal.appealSiteSection.identifyingTheOwners = null;
      expect(createOrUpdateAppeal).toHaveBeenCalledWith(expectedAppeal);
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
          'know-the-owners': 'yes',
        },
      };

      await postKnowTheOwners(req, res);

      expect(getTaskStatus).toHaveBeenCalledWith(appeal, sectionName, taskName);
      expect(createOrUpdateAppeal).toHaveBeenCalledWith(appeal);
      expect(res.redirect).toHaveBeenCalledWith(`/${TELLING_THE_LANDOWNERS}`);
      expect(req.session.appeal).toEqual(submittedAppeal);
    });

    it('should redirect to the correct page if `some` has been selected and appeal.appealSiteSection is not defined', async () => {
      const submittedAppeal = {
        ...appeal,
        state: 'SUBMITTED',
      };

      delete appeal.appealSiteSection;

      createOrUpdateAppeal.mockReturnValue(submittedAppeal);

      req = {
        ...req,
        body: {
          'know-the-owners': 'some',
        },
      };

      await postKnowTheOwners(req, res);

      expect(getTaskStatus).toHaveBeenCalledWith(appeal, sectionName, taskName);
      expect(createOrUpdateAppeal).toHaveBeenCalledWith(appeal);
      expect(res.redirect).toHaveBeenCalledWith(`/${IDENTIFYING_THE_OWNERS}`);
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
          'know-the-owners': 'no',
        },
      };

      await postKnowTheOwners(req, res);

      expect(getTaskStatus).toHaveBeenCalledWith(appeal, sectionName, taskName);
      expect(createOrUpdateAppeal).toHaveBeenCalledWith(appeal);
      expect(res.redirect).toHaveBeenCalledWith(`/${IDENTIFYING_THE_OWNERS}`);
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
          'know-the-owners': 'yes',
        },
      };

      await postKnowTheOwners(req, res);

      expect(getTaskStatus).toHaveBeenCalledWith(appeal, sectionName, taskName);
      expect(createOrUpdateAppeal).toHaveBeenCalledWith(appeal);
      expect(res.redirect).toHaveBeenCalledWith(`/${TELLING_THE_LANDOWNERS}`);
      expect(req.session.appeal).toEqual(submittedAppeal);
    });

    it('should redirect to the correct page if `some` has been selected and appeal.sectionStates.appealSiteSection is not defined', async () => {
      const submittedAppeal = {
        ...appeal,
        state: 'SUBMITTED',
      };

      delete appeal.sectionStates.appealSiteSection;

      createOrUpdateAppeal.mockReturnValue(submittedAppeal);

      req = {
        ...req,
        body: {
          'know-the-owners': 'some',
        },
      };

      await postKnowTheOwners(req, res);

      expect(getTaskStatus).toHaveBeenCalledWith(appeal, sectionName, taskName);
      expect(createOrUpdateAppeal).toHaveBeenCalledWith(appeal);
      expect(res.redirect).toHaveBeenCalledWith(`/${IDENTIFYING_THE_OWNERS}`);
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
          'know-the-owners': 'no',
        },
      };

      await postKnowTheOwners(req, res);

      expect(getTaskStatus).toHaveBeenCalledWith(appeal, sectionName, taskName);
      expect(createOrUpdateAppeal).toHaveBeenCalledWith(appeal);
      expect(res.redirect).toHaveBeenCalledWith(`/${IDENTIFYING_THE_OWNERS}`);
      expect(req.session.appeal).toEqual(submittedAppeal);
    });
  });
});
