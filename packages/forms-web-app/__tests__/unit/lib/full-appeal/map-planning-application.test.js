const { APPEAL_ID } = require('@pins/business-rules/src/constants');
const {
	mapPlanningApplication,
	getAppealTypeName
} = require('../../../../src/lib/full-appeal/map-planning-application');

describe('/lib/full-appeal/map-planning-application', () => {
	it('should map full appeal planning application', () => {
		const planningApplication = 'full-appeal';
		const appealType = mapPlanningApplication(planningApplication);

		expect(appealType).toEqual(APPEAL_ID.PLANNING_SECTION_78);
	});

	it('should map householder planning application', () => {
		const planningApplication = 'householder-planning';
		const appealType = mapPlanningApplication(planningApplication);

		expect(appealType).toEqual(APPEAL_ID.HOUSEHOLDER);
	});

	it('should map listed building planning application', () => {
		const planningApplication = 'listed-building';
		const appealType = mapPlanningApplication(planningApplication);

		expect(appealType).toEqual(APPEAL_ID.PLANNING_LISTED_BUILDING);
	});

	[
		{ id: APPEAL_ID.HOUSEHOLDER, name: 'Householder appeal' },
		{ id: APPEAL_ID.PLANNING_SECTION_78, name: 'Full appeal' }
	].forEach(({ id, name }) => {
		it(`should map appeal type id: ${id} to appeal name: ${name}`, () => {
			expect(getAppealTypeName(id)).toEqual(name);
		});
	});
});
