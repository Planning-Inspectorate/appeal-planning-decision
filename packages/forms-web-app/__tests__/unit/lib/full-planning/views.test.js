const { VIEW } = require('../../../../src/lib/full-planning/views');

describe('/lib/full-planning/views', () => {
  it('should have the expected defined constants', () => {
    expect(VIEW).toEqual({
      FULL_APPEAL: {
        TASK_LIST: 'full-planning/full-appeal/task-list',
        CHECK_ANSWERS: 'full-planning/full-appeal/check-answers',
        CONTACT_DETAILS: 'full-planning/full-appeal/contact-details',
        APPLICATION_FORM: 'full-planning/full-appeal/application-form',
        APPLICATION_NUMBER: 'full-planning/full-appeal/application-number',
      },
    });
  });
});
