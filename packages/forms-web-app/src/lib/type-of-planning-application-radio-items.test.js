const {
	TYPE_OF_PLANNING_APPLICATION: {
		FULL_APPEAL,
		LISTED_BUILDING,
		OUTLINE_PLANNING,
		MINOR_COMMERCIAL_DEVELOPMENT,
		ADVERTISEMENT,
		LAWFUL_DEVELOPMENT_CERTIFICATE,
		ENFORCEMENT_NOTICE,
		ENFORCEMENT_LISTED_BUILDING
	}
} = require('@pins/business-rules/src/constants');
const {
	typeOfPlanningApplicationRadioItems
} = require('./type-of-planning-application-radio-items');

describe('typeOfPlanningApplicationRadioItems', () => {
	it('returns items list with LISTED_BUILDING', () => {
		const itemsList = typeOfPlanningApplicationRadioItems(false, false);
		expect(itemsList.length).toEqual(12);
		expect(itemsList[2].value).toEqual(LISTED_BUILDING);
	});

	it('returns items list with OUTLINE_PLANNING', () => {
		const itemsList = typeOfPlanningApplicationRadioItems(false, false);
		expect(itemsList.length).toEqual(12);
		expect(itemsList[5].value).toEqual(OUTLINE_PLANNING);
	});

	it('returns minor commercial', () => {
		const itemsList = typeOfPlanningApplicationRadioItems(false, false);
		expect(itemsList.length).toEqual(12);
		expect(itemsList[4].value).toEqual(MINOR_COMMERCIAL_DEVELOPMENT);
	});

	it('returns advertisement', () => {
		const itemsList = typeOfPlanningApplicationRadioItems(false, false);
		expect(itemsList.length).toEqual(12);
		expect(itemsList[3].value).toEqual(ADVERTISEMENT);
	});

	it('returns lawful development certificate if ldc feature flag true', () => {
		const itemsList = typeOfPlanningApplicationRadioItems(true, false);
		expect(itemsList.length).toEqual(13);
		expect(itemsList[5].value).toEqual(LAWFUL_DEVELOPMENT_CERTIFICATE);
	});

	it('returns enforcement and enforcement listed if new_bys_enforcement feature flag true', () => {
		const itemsList = typeOfPlanningApplicationRadioItems(false, true);
		expect(itemsList.length).toEqual(14);
		expect(itemsList[3].value).toEqual(ENFORCEMENT_NOTICE);
		expect(itemsList[4].value).toEqual(ENFORCEMENT_LISTED_BUILDING);
	});

	it('sets checked for type of planning application', () => {
		const itemsList = typeOfPlanningApplicationRadioItems(false, false, FULL_APPEAL);
		expect(itemsList[0].checked).toEqual(true);
	});
});
