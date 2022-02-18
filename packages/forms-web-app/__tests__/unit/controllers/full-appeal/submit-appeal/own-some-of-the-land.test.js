const appeal = require('@pins/business-rules/test/data/full-appeal');
const v8 = require('v8');
const {
  getOwnSomeOfTheLand,
  postOwnSomeOfTheLand,
} = require('../../../../../src/controllers/full-appeal/submit-appeal/own-some-of-the-land');
const { createOrUpdateAppeal } = require('../../../../../src/lib/appeals-api-wrapper');
const { getTaskStatus } = require('../../../../../src/services/task.service');
const { mockReq, mockRes } = require('../../../mocks');
const {
  VIEW: {
    FULL_APPEAL: { OWN_SOME_OF_THE_LAND, KNOW_THE_OWNERS },
  },
} = require('../../../../../src/lib/full-appeal/views');

jest.mock('../../../../../src/lib/appeals-api-wrapper');
jest.mock('../../../../../src/services/task.service');

describe('controllers/full-appeal/submit-appeal/own-some-of-the-land', () => {
  let req;
  let res;

  const sectionName = 'appealSiteSection';
  const taskName = 'siteOwnership';
  const errors = { 'own-some-of-the-land': 'Select an option' };
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

  describe('getOwnSomeOfTheLand', () => {
    it('should call the correct template', () => {
      getOwnSomeOfTheLand(req, res);

      expect(res.render).toHaveBeenCalledTimes(1);
      expect(res.render).toHaveBeenCalledWith(OWN_SOME_OF_THE_LAND, {
        ownsSomeOfTheLand: false,
      });
    });
  });

  describe('postOwnSomeOfTheLand', () => {
    it('should re-render the template with errors if submission validation fails', async () => {
      req = {
        ...req,
        body: {
          'own-some-of-the-land': undefined,
          errors,
          errorSummary,
        },
      };

      await postOwnSomeOfTheLand(req, res);

      expect(res.redirect).not.toHaveBeenCalled();
      expect(res.render).toHaveBeenCalledTimes(1);
      expect(res.render).toHaveBeenCalledWith(OWN_SOME_OF_THE_LAND, {
        errors,
        errorSummary,
      });
    });

    it('should re-render the template with errors if an error is thrown', async () => {
      const error = new Error('Internal Server Error');

      createOrUpdateAppeal.mockImplementation(() => {
        throw error;
      });

      await postOwnSomeOfTheLand(req, res);

      expect(res.redirect).not.toHaveBeenCalled();
      expect(res.render).toHaveBeenCalledTimes(1);
      expect(res.render).toHaveBeenCalledWith(OWN_SOME_OF_THE_LAND, {
        ownsSomeOfTheLand: false,
        errors: {},
        errorSummary: [{ text: error.toString(), href: '#' }],
      });
    });

    it('should redirect to the correct page if `yes` has been selected', async () => {
      const submittedAppeal = {
        ...appeal,
        state: 'SUBMITTED',
      };
      submittedAppeal[sectionName][taskName].ownsSomeOfTheLand = true;

      createOrUpdateAppeal.mockReturnValue(submittedAppeal);
      getTaskStatus.mockReturnValue('NOT STARTED');

      req = {
        ...req,
        body: {
          'own-some-of-the-land': 'yes',
        },
      };

      await postOwnSomeOfTheLand(req, res);

      expect(getTaskStatus).toHaveBeenCalledWith(appeal, sectionName, taskName);
      expect(createOrUpdateAppeal).toHaveBeenCalledWith(appeal);
      expect(res.redirect).toHaveBeenCalledWith(`/${KNOW_THE_OWNERS}`);
      expect(req.session.appeal).toEqual(submittedAppeal);
    });

    it('should redirect to the correct page if `no` has been selected', async () => {
      const submittedAppeal = {
        ...appeal,
        state: 'SUBMITTED',
      };
      submittedAppeal[sectionName][taskName].ownsSomeOfTheLand = false;

      createOrUpdateAppeal.mockReturnValue(submittedAppeal);
      getTaskStatus.mockReturnValue('NOT STARTED');

      req = {
        ...req,
        body: {
          'own-some-of-the-land': 'no',
        },
      };

      await postOwnSomeOfTheLand(req, res);

      expect(getTaskStatus).toHaveBeenCalledWith(appeal, sectionName, taskName);
      expect(createOrUpdateAppeal).toHaveBeenCalledWith(appeal);
      expect(res.redirect).toHaveBeenCalledWith(`/${KNOW_THE_OWNERS}`);
      expect(req.session.appeal).toEqual(submittedAppeal);
    });
  });
});
