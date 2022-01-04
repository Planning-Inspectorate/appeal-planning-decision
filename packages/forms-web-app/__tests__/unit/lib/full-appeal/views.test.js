const { VIEW } = require('../../../../src/lib/full-appeal/views');

describe('/lib/full-appeal/views', () => {
  it('should have the expected defined constants', () => {
    expect(VIEW).toEqual({
      FULL_APPEAL: {
        TASK_LIST: 'full-appeal/submit-appeal/task-list',
        CHECK_ANSWERS: 'full-appeal/submit-appeal/check-answers',
        CONTACT_DETAILS: 'full-appeal/submit-appeal/contact-details',
        APPLICATION_FORM: 'full-appeal/submit-appeal/application-form',
        APPLICATION_NUMBER: 'full-appeal/submit-appeal/application-number',
      },
    });
  });
});
