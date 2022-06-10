const applicationSavedController = require('../../../../src/controllers/submit-appeal/application-saved');

const { VIEW } = require('../../../../src/lib/submit-appeal/views');
const { mockReq, mockRes } = require('../../mocks');

describe('controllers/submit-appeal/application-saved', () => {
  let req = mockReq();
  let res = mockRes();
  it('getApplicationSaved method calls the correct template', async () => {
    req = {
      session: {
        appeal: {
          decisionDate: '2022-02-20T00:00:00.000Z',
          planningApplicationDocumentsSection: { applicationNumber: '123456' },
        },
      },
    };
    await applicationSavedController.getApplicationSaved(req, res);

    expect(res.render).toBeCalledWith(VIEW.SUBMIT_APPEAL.APPLICATION_SAVED, {
      applicationNumber: '123456',
      deadline: { date: 20, day: 'Saturday', month: 'August', year: 2022 },
    });
  });
});
