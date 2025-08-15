const {
	TYPE_OF_PLANNING_APPLICATION: {
		FULL_APPEAL,
		LISTED_BUILDING,
		OUTLINE_PLANNING,
		MINOR_COMMERCIAL_DEVELOPMENT,
		ADVERTISEMENT
	}
} = require('@pins/business-rules/src/constants');
const {
	typeOfPlanningApplicationRadioItems
} = require('./type-of-planning-application-radio-items');

describe('typeOfPlanningApplicationRadioItems', () => {
	it('returns items list with listed building if s20 feature flag true', () => {
		const itemsList = typeOfPlanningApplicationRadioItems(true, false, false);
		expect(itemsList.length).toEqual(10);
		expect(itemsList[2].value).toEqual(LISTED_BUILDING);
	});

	it('returns items list without conditionals if feature flags false', () => {
		const itemsList = typeOfPlanningApplicationRadioItems(false, false, false);
		expect(itemsList.length).toEqual(9);
		expect(itemsList[2].value).toEqual(OUTLINE_PLANNING);
	});

	it('returns items list without minor commercial if feature flag false', () => {
		const itemsList = typeOfPlanningApplicationRadioItems(false, false, false);
		expect(itemsList.length).toEqual(9);
		expect(itemsList[2].value).toEqual(OUTLINE_PLANNING);
	});

	it('returns minor commercial if feature flag true', () => {
		const itemsList = typeOfPlanningApplicationRadioItems(false, true, false);
		expect(itemsList.length).toEqual(10);
		expect(itemsList[2].value).toEqual(MINOR_COMMERCIAL_DEVELOPMENT);
	});
	it('returns advertisement if feature flag true', () => {
		const itemsList = typeOfPlanningApplicationRadioItems(false, false, true);
		expect(itemsList.length).toEqual(10);
		expect(itemsList[2].value).toEqual(ADVERTISEMENT);
	});

	it('sets checked for type of planning application', () => {
		const itemsList = typeOfPlanningApplicationRadioItems(true, false, false, FULL_APPEAL);
		expect(itemsList[0].checked).toEqual(true);
	});
});
