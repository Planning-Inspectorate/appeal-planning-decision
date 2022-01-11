const { VIEW } = require('../../../../src/lib/householder-planning/views');

describe('/lib/householder-planning/views', () => {
  it('should have the expected defined constants', () => {
    expect(VIEW).toEqual({
      HOUSEHOLDER_PLANNING: {
        LISTED_BUILDING: 'householder-planning/eligibility/listed-building-householder',
        ELIGIBILITY: {
          ENFORCEMENT_NOTICE_HOUSEHOLDER:
            'householder-planning/eligibility/enforcement-notice-householder',
          GRANTED_OR_REFUSED: 'householder-planning/eligibility/granted-or-refused-householder',
        },
      },
    });
  });
});
