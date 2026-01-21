const {
	TYPE_OF_PLANNING_APPLICATION: {
		FULL_APPEAL,
		LISTED_BUILDING,
		OUTLINE_PLANNING,
		MINOR_COMMERCIAL_DEVELOPMENT,
		ADVERTISEMENT,
		LAWFUL_DEVELOPMENT_CERTIFICATE
	}
} = require('@pins/business-rules/src/constants');
const {
	typeOfPlanningApplicationRadioItems
} = require('./type-of-planning-application-radio-items');

describe('typeOfPlanningApplicationRadioItems', () => {
	it('returns items list with LISTED_BUILDING', () => {
		const itemsList = typeOfPlanningApplicationRadioItems(false, false, false, false);
		expect(itemsList.length).toEqual(10);
		expect(itemsList[2].value).toEqual(LISTED_BUILDING);
	});

	it('returns items list with OUTLINE_PLANNING', () => {
		const itemsList = typeOfPlanningApplicationRadioItems(false, false, false, false);
		expect(itemsList.length).toEqual(10);
		expect(itemsList[3].value).toEqual(OUTLINE_PLANNING);
	});

	it('returns minor commercial if feature flag true', () => {
		const itemsList = typeOfPlanningApplicationRadioItems(true, false, false, false);
		expect(itemsList.length).toEqual(11);
		expect(itemsList[3].value).toEqual(MINOR_COMMERCIAL_DEVELOPMENT);
	});

	it('returns advertisement if cas advert feature flag true', () => {
		const itemsList = typeOfPlanningApplicationRadioItems(false, true, false, false);
		expect(itemsList.length).toEqual(11);
		expect(itemsList[3].value).toEqual(ADVERTISEMENT);
	});

	it('returns advertisement if advert feature flag true', () => {
		const itemsList = typeOfPlanningApplicationRadioItems(false, false, true, false);
		expect(itemsList.length).toEqual(11);
		expect(itemsList[3].value).toEqual(ADVERTISEMENT);
	});

	it('returns lawful development certificate if ldc feature flag true', () => {
		const itemsList = typeOfPlanningApplicationRadioItems(false, false, false, true);
		expect(itemsList.length).toEqual(11);
		expect(itemsList[3].value).toEqual(LAWFUL_DEVELOPMENT_CERTIFICATE);
	});

	it('sets checked for type of planning application', () => {
		const itemsList = typeOfPlanningApplicationRadioItems(false, false, false, false, FULL_APPEAL);
		expect(itemsList[0].checked).toEqual(true);
	});
});
