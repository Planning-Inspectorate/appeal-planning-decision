const procedureTypeController = require('../../../../src/controllers/full-appeal/procedure-type');
const { createOrUpdateAppeal } = require('../../../../src/lib/appeal-reply-api-wrapper');
const { VIEW } = require('../../../../src/lib/views');
const logger = require('../../../../src/lib/logger');
const appealReply = require('../../emptyAppealReply');
const { mockReq, mockRes } = require('../../mocks');

jest.mock('../../../../src/lib/appeal-reply-api-wrapper');
jest.mock('../../../../src/lib/logger');

describe('controllers/full-appeal/procedure-type', () => {
  let req;
  let res;
  let mockAppealReply;

  beforeEach(() => {
    req = mockReq();
    res = mockRes();

    mockAppealReply = { ...appealReply };

    jest.resetAllMocks();
  });

  describe('getProcedureType', () => {
    it('should call the correct template', () => {
      procedureTypeController.getProcedureType(req, res);

      expect(res.render).toHaveBeenCalledWith(VIEW.PROCEDURE_TYPE, {
        procedureType: null,
        backLink: VIEW.TASK_LIST,
      });
    });
  });

  describe('postProcedureType', () => {
    it('should re-render the template with a validation error for no selection made', async () => {
      const mockRequest = {
        ...req,
        body: {
          'procedure-type': null,
          errors: {
            'procedure-type':
              'Select the procedure that you think is most appropriate for this appeal',
          },
          errorSummary: [
            {
              text: 'Select the procedure that you think is most appropriate for this appeal',
              href: '#',
            },
          ],
        },
      };
      await procedureTypeController.postProcedureType(mockRequest, res);

      expect(createOrUpdateAppeal).not.toHaveBeenCalled();
      expect(res.redirect).not.toHaveBeenCalled();
      expect(res.render).toHaveBeenCalledWith(VIEW.PROCEDURE_TYPE, {
        procedureType: null,
        errors: {
          'procedure-type':
            'Select the procedure that you think is most appropriate for this appeal',
        },
        errorSummary: [
          {
            text: 'Select the procedure that you think is most appropriate for this appeal',
            href: '#',
          },
        ],
        backLink: VIEW.TASK_LIST,
      });
    });

    it('should re-render the template with errors if there is any api call error', async () => {
      const mockRequest = {
        ...req,
        body: {},
      };

      const error = new Error('Api call error');
      createOrUpdateAppeal.mockImplementation(() => Promise.reject(error));

      await procedureTypeController.postProcedureType(mockRequest, res);

      expect(res.redirect).not.toHaveBeenCalled();
      expect(logger.error).toHaveBeenCalledWith(error);
      expect(res.render).toHaveBeenCalledWith(VIEW.PROCEDURE_TYPE, {
        procedureType: undefined,
        errors: {},
        errorSummary: [{ text: error.toString(), href: '#' }],
        backLink: VIEW.TASK_LIST,
      });
    });

    it('should redirect to tasklist page if selection is made with no errors', async () => {
      const mockRequest = {
        ...req,
        body: {
          'procedure-type': 'hearing',
        },
      };
      await procedureTypeController.postProcedureType(mockRequest, res);

      mockAppealReply.fullAppealSection.procedureType = 'hearing';

      expect(createOrUpdateAppeal).toHaveBeenCalledWith(mockAppealReply);
      expect(res.redirect).toHaveBeenCalledWith(VIEW.TASK_LIST);
    });
  });
});
