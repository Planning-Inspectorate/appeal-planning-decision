const appeal = require('@pins/business-rules/test/data/full-appeal');
const v8 = require('v8');
const {
  getPlanningObligationDeadline,
  postPlanningObligationDeadline
} = require('../../../../../src/controllers/full-appeal/submit-appeal/planning-obligation-deadline');
const { createOrUpdateAppeal } = require('../../../../../src/lib/appeals-api-wrapper');

const { VIEW } = require('../../../../../src/lib/full-appeal/views');

const { mockReq, mockRes } = require('../../../mocks');
jest.mock('../../../../../src/lib/appeals-api-wrapper');
jest.mock('../../../../../src/lib/documents-api-wrapper');

describe('controllers/full-appeal/submit-appeal/planning-obligation-deadline', () => {
  let req;
  let res;
  const errors = { };
  const errorSummary = [{ text: 'There was an error', href: '#' }];

  beforeEach(() => {
    req = v8.deserialize(
      v8.serialize({
        ...mockReq(appeal),
        body: {
          errors,
          errorSummary
        }
      })
    );
    res = mockRes();

    jest.resetAllMocks();
  });

  describe('getPlanningObligationDeadline', () => {
    it('calls correct template', async () => {
      await getPlanningObligationDeadline(req, res);
      expect(res.render).toBeCalledWith(VIEW.FULL_APPEAL.PLANNING_OBLIGATION_DEADLINE, {
        planningObligationDeadline: true,
      });
    });
  });

  describe('postPlanningObligationDeadline', () => {
    it('should re-render the template with errors if an error is thrown', async () => {
      const error = new Error('Internal Server Error');

      createOrUpdateAppeal.mockImplementation(() => Promise.reject(error));

      await postPlanningObligationDeadline(req, res);

      expect(res.redirect).not.toHaveBeenCalled();
      expect(res.render).toHaveBeenCalledTimes(1);
    });

    
    it('should re-render the template with errors if an given error is thrown', async () => {
      const error = new Error('Internal Server Error');

      createOrUpdateAppeal.mockImplementation(() => Promise.reject(error));

      await postPlanningObligationDeadline(req, res);

      expect(res.redirect).not.toHaveBeenCalled();
      expect(res.render).toHaveBeenCalledTimes(1);
      expect(res.render).toHaveBeenCalledWith(VIEW.FULL_APPEAL.PLANNING_OBLIGATION_DEADLINE, {
        errors: {},
        errorSummary: [{ text: error.toString(), href: '#' }],
      });
    });

    it('should redirect to correct page if planning-obligation-deadline is no', async () => {
      req = {
        ...req,
        body: {
          'planning-obligation-deadline': 'no',
        },
      };
      await postPlanningObligationDeadline(req, res);
      expect(res.render).not.toHaveBeenCalled();
      expect(res.redirect).toHaveBeenCalledWith(`/${VIEW.FULL_APPEAL.NEW_DOCUMENTS}`);
    });
  });

});
