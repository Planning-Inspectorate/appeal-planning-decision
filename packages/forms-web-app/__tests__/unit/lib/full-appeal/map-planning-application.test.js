const { APPEAL_ID } = require('@pins/business-rules/src/constants');
const mapping = require('../../../../src/lib/full-appeal/map-planning-application');

describe('/lib/full-appeal/map-planning-application', () => {
  it('should map full appeal planning application', () => {
    const planningApplication = 'full-appeal';
    const appealType = mapping(planningApplication);

    expect(appealType).toEqual(APPEAL_ID.PLANNING_SECTION_78);
  });

  it('should map householder planning application', () => {
    const planningApplication = 'householder-planning';
    const appealType = mapping(planningApplication);

    expect(appealType).toEqual(APPEAL_ID.HOUSEHOLDER);
  });
});
