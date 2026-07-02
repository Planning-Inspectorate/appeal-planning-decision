const {
	TYPE_OF_PLANNING_APPLICATION: {
		FULL_APPEAL,
		HOUSEHOLDER_PLANNING,
		LISTED_BUILDING,
		OUTLINE_PLANNING,
		PRIOR_APPROVAL,
		RESERVED_MATTERS,
		REMOVAL_OR_VARIATION_OF_CONDITIONS,
		SOMETHING_ELSE,
		I_HAVE_NOT_MADE_A_PLANNING_APPLICATION,
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
	it.each([
		[FULL_APPEAL, 0],
		[HOUSEHOLDER_PLANNING, 1],
		[LISTED_BUILDING, 2],
		[ENFORCEMENT_NOTICE, 3],
		[ENFORCEMENT_LISTED_BUILDING, 4],
		[ADVERTISEMENT, 5],
		[MINOR_COMMERCIAL_DEVELOPMENT, 6],
		[OUTLINE_PLANNING, 7],
		[PRIOR_APPROVAL, 8],
		[RESERVED_MATTERS, 9],
		[REMOVAL_OR_VARIATION_OF_CONDITIONS, 10],
		[SOMETHING_ELSE, 11],
		// Index 12 is for 'or' divider
		[I_HAVE_NOT_MADE_A_PLANNING_APPLICATION, 13]
	])(`returns items list with %s, ldc flag === false`, (typeOfApplication, index) => {
		const itemsList = typeOfPlanningApplicationRadioItems(false);
		expect(itemsList.length).toEqual(14);
		expect(itemsList[index].value).toEqual(typeOfApplication);
	});

	it('returns lawful development certificate if ldc feature flag true', () => {
		const itemsList = typeOfPlanningApplicationRadioItems(true);
		expect(itemsList.length).toEqual(15);
		expect(itemsList[7].value).toEqual(LAWFUL_DEVELOPMENT_CERTIFICATE);
	});

	it('sets checked for type of planning application', () => {
		const itemsList = typeOfPlanningApplicationRadioItems(false, FULL_APPEAL);
		expect(itemsList[0].checked).toEqual(true);
	});
});
