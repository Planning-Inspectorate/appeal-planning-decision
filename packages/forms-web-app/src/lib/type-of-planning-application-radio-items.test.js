const {
	TYPE_OF_PLANNING_APPLICATION: { FULL_APPEAL, LISTED_BUILDING, OUTLINE_PLANNING }
} = require('@pins/business-rules/src/constants');
const {
	typeOfPlanningApplicationRadioItems
} = require('./type-of-planning-application-radio-items');

describe('typeOfPlanningApplicationRadioItems', () => {
	it('returns items list with listed building if s20 feature flag true', () => {
		const itemsList = typeOfPlanningApplicationRadioItems(true);
		expect(itemsList.length).toEqual(10);
		expect(itemsList[2].value).toEqual(LISTED_BUILDING);
	});
	it('returns items list without listed building if feature flag false', () => {
		const itemsList = typeOfPlanningApplicationRadioItems(false);
		expect(itemsList.length).toEqual(9);
		expect(itemsList[2].value).toEqual(OUTLINE_PLANNING);
	});

	it('sets checked for type of planning application', () => {
		const itemsList = typeOfPlanningApplicationRadioItems(true, FULL_APPEAL);
		expect(itemsList[0].checked).toEqual(true);
	});
});
