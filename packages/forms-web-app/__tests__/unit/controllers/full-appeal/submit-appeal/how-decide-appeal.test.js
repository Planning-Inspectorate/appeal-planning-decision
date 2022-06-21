const appeal = require('@pins/business-rules/test/data/full-appeal');
const v8 = require('v8');
const {
  getHowDecideAppeal,
  postHowDecideAppeal,
} = require('../../../../../src/controllers/full-appeal/submit-appeal/how-decide-appeal');
const { createOrUpdateAppeal } = require('../../../../../src/lib/appeals-api-wrapper');
const { mockReq, mockRes } = require('../../../mocks');
const {
  VIEW: {
    FULL_APPEAL: { HOW_DECIDE_APPEAL, TASK_LIST, WHY_HEARING, WHY_INQUIRY },
  },
} = require('../../../../../src/lib/full-appeal/views');
const TASK_STATUS = require('../../../../../src/services/task-status/task-statuses');
const { postSaveAndReturn } = require('../../../../../src/controllers/save');

jest.mock('../../../../../src/lib/appeals-api-wrapper');
jest.mock('../../../../../src/services/task.service');
jest.mock('../../../../../src/controllers/save');

describe('controllers/full-appeal/submit-appeal/how-decide-appeal', () => {
  let req;
  let res;

  const sectionName = 'appealDecisionSection';
  const taskName = 'procedureType';
  const procedureType = 'Hearing';
  const errors = { 'procedure-type': 'Select an option' };
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

  describe('getHowDecideAppeal', () => {
    it('should call the correct template', () => {
      getHowDecideAppeal(req, res);

      expect(res.render).toHaveBeenCalledTimes(1);
      expect(res.render).toHaveBeenCalledWith(HOW_DECIDE_APPEAL, {
        procedureType,
      });
    });
  });

  describe('postHowDecideAppeal', () => {
    it('should re-render the template with errors if submission validation fails', async () => {
      req = {
        ...req,
        body: {
          'procedure-type': undefined,
          errors,
          errorSummary,
        },
      };

      await postHowDecideAppeal(req, res);

      expect(res.redirect).not.toHaveBeenCalled();
      expect(res.render).toHaveBeenCalledTimes(1);
      expect(res.render).toHaveBeenCalledWith(HOW_DECIDE_APPEAL, {
        errors,
        errorSummary,
      });
    });

    it('should re-render the template with errors if an error is thrown', async () => {
      const error = new Error('Internal Server Error');

      createOrUpdateAppeal.mockImplementation(() => {
        throw error;
      });

      req = {
        ...req,
        body: {
          'procedure-type': 'Hearing',
        },
      };

      await postHowDecideAppeal(req, res);

      expect(res.redirect).not.toHaveBeenCalled();
      expect(res.render).toHaveBeenCalledTimes(1);
      expect(res.render).toHaveBeenCalledWith(HOW_DECIDE_APPEAL, {
        procedureType,
        errors: {},
        errorSummary: [{ text: error.toString(), href: '#' }],
      });
    });

    it('should redirect to the correct page if `Written Representation` has been selected', async () => {
      const submittedAppeal = {
        ...appeal,
        state: 'SUBMITTED',
      };
      submittedAppeal[sectionName][taskName] = 'Written Representation';
      submittedAppeal.sectionStates.appealDecisionSection.procedureType = TASK_STATUS.COMPLETED;

      createOrUpdateAppeal.mockReturnValue(submittedAppeal);

      req = {
        ...req,
        body: {
          'procedure-type': 'Written Representation',
        },
      };

      await postHowDecideAppeal(req, res);

      expect(createOrUpdateAppeal).toHaveBeenCalledWith(appeal);
      expect(res.redirect).toHaveBeenCalledWith(`/${TASK_LIST}`);
      expect(req.session.appeal).toEqual(submittedAppeal);
    });

    it('should redirect to the correct page if `Hearing` has been selected', async () => {
      const submittedAppeal = {
        ...appeal,
        state: 'SUBMITTED',
      };
      submittedAppeal[sectionName][taskName] = 'Hearing';
      submittedAppeal.sectionStates.appealDecisionSection.procedureType = TASK_STATUS.COMPLETED;

      createOrUpdateAppeal.mockReturnValue(submittedAppeal);

      req = {
        ...req,
        body: {
          'procedure-type': 'Hearing',
        },
      };

      await postHowDecideAppeal(req, res);

      expect(createOrUpdateAppeal).toHaveBeenCalledWith(appeal);
      expect(res.redirect).toHaveBeenCalledWith(`/${WHY_HEARING}`);
      expect(req.session.appeal).toEqual(submittedAppeal);
    });

    it('should redirect to the correct page if `Inquiry` has been selected', async () => {
      const submittedAppeal = {
        ...appeal,
        state: 'SUBMITTED',
      };
      submittedAppeal[sectionName][taskName] = 'Inquiry';
      submittedAppeal.sectionStates.appealDecisionSection.procedureType = TASK_STATUS.COMPLETED;

      createOrUpdateAppeal.mockReturnValue(submittedAppeal);

      req = {
        ...req,
        body: {
          'procedure-type': 'Inquiry',
        },
      };

      await postHowDecideAppeal(req, res);

      expect(createOrUpdateAppeal).toHaveBeenCalledWith(appeal);
      expect(res.redirect).toHaveBeenCalledWith(`/${WHY_INQUIRY}`);
      expect(req.session.appeal).toEqual(submittedAppeal);
    });

    it('should re-render the template with errors if submission validation fails (save and return)', async () => {
      req = {
        ...req,
        body: {
          'procedure-type': undefined,
          'save-and-return': '',
          errors,
          errorSummary,
        },
      };

      await postHowDecideAppeal(req, res);

      expect(postSaveAndReturn).not.toHaveBeenCalled();
      expect(res.redirect).not.toHaveBeenCalled();
      expect(res.render).toHaveBeenCalledTimes(1);
      expect(res.render).toHaveBeenCalledWith(HOW_DECIDE_APPEAL, {
        errors,
        errorSummary,
      });
    });

    it('should re-render the template with errors if an error is thrown (save and return)', async () => {
      const error = new Error('Internal Server Error');

      createOrUpdateAppeal.mockImplementation(() => {
        throw error;
      });

      req = {
        ...req,
        body: {
          'procedure-type': 'Hearing',
          'save-and-return': '',
        },
      };

      await postHowDecideAppeal(req, res);

      expect(res.redirect).not.toHaveBeenCalled();
      expect(postSaveAndReturn).not.toHaveBeenCalled();
      expect(res.render).toHaveBeenCalledTimes(1);
      expect(res.render).toHaveBeenCalledWith(HOW_DECIDE_APPEAL, {
        procedureType,
        errors: {},
        errorSummary: [{ text: error.toString(), href: '#' }],
      });
    });

    it('should redirect to the correct page if save and return', async () => {
      const submittedAppeal = {
        ...appeal,
        state: 'SUBMITTED',
      };
      submittedAppeal[sectionName][taskName] = 'Written Representation';
      submittedAppeal.sectionStates.appealDecisionSection.procedureType = TASK_STATUS.IN_PROGRESS;

      createOrUpdateAppeal.mockReturnValue(submittedAppeal);

      req = {
        ...req,
        body: {
          'procedure-type': 'Written Representation',
          'save-and-return': '',
        },
      };

      await postHowDecideAppeal(req, res);

      expect(createOrUpdateAppeal).toHaveBeenCalledWith(appeal);
      expect(res.redirect).not.toHaveBeenCalled();
      expect(postSaveAndReturn).toHaveBeenCalledWith(req, res);
      expect(req.session.appeal).toEqual(submittedAppeal);
    });
  });
});
