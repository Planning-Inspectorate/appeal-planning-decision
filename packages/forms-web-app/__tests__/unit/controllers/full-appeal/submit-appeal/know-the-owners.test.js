const appeal = require('@pins/business-rules/test/data/full-appeal');
const v8 = require('v8');
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

  const sectionName = 'appealSiteSection';
  const taskName = 'siteOwnership';
  const errors = { 'know-the-owners': 'Select an option' };
  const errorSummary = [{ text: 'There was an error', href: '#' }];

  beforeEach(() => {
    req = v8.deserialize(
      v8.serialize({
        ...mockReq(appeal),
        body: {},
      })
    );
    res = mockRes();

    jest.resetAllMocks();
  });

  describe('getKnowTheOwners', () => {
    it('should call the correct template', () => {
      getKnowTheOwners(req, res);

      expect(res.render).toHaveBeenCalledTimes(1);
      expect(res.render).toHaveBeenCalledWith(KNOW_THE_OWNERS, {
        ownsSomeOfTheLand: false,
        knowsTheOwners: 'yes',
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
        ownsSomeOfTheLand: false,
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
        ownsSomeOfTheLand: false,
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
      getTaskStatus.mockReturnValue('NOT STARTED');

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
      submittedAppeal[sectionName][taskName].knowsTheOwners = 'some';

      createOrUpdateAppeal.mockReturnValue(submittedAppeal);
      getTaskStatus.mockReturnValue('NOT STARTED');

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
      submittedAppeal[sectionName][taskName].knowsTheOwners = 'no';
      submittedAppeal[sectionName][taskName].hasIdentifiedTheOwners = null;

      createOrUpdateAppeal.mockReturnValue(submittedAppeal);
      getTaskStatus.mockReturnValue('NOT STARTED');

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
      submittedAppeal[sectionName][taskName].knowsTheOwners = 'some';

      req = {
        ...req,
        body: {
          'know-the-owners': 'some',
        },
      };
      req.session.appeal[sectionName][taskName].knowsTheOwners = 'no';

      createOrUpdateAppeal.mockReturnValue(submittedAppeal);
      getTaskStatus.mockReturnValue('NOT STARTED');

      await postKnowTheOwners(req, res);

      expect(createOrUpdateAppeal).toHaveBeenCalledWith(submittedAppeal);
    });
  });
});
