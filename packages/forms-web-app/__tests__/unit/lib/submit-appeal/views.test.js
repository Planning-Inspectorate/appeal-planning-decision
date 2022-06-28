const { VIEW } = require('../../../../src/lib/submit-appeal/views');

describe('lib/submit-appeal/views', () => {
  it('should have the expected defined constants', () => {
    expect(VIEW).toEqual({
      SUBMIT_APPEAL: {
        ENTER_APPEAL_DETAILS: 'submit-appeal/enter-appeal-details',
        APPLICATION_SAVED: 'submit-appeal/application-saved',
      },
    });
  });
});
