const {
	constants: {
		TYPE_OF_PLANNING_APPLICATION: {
			FULL_APPEAL,
			HOUSEHOLDER_PLANNING,
			LISTED_BUILDING,
			I_HAVE_NOT_MADE_A_PLANNING_APPLICATION,
			ADVERTISEMENT,
			MINOR_COMMERCIAL_DEVELOPMENT,
			OUTLINE_PLANNING,
			PRIOR_APPROVAL,
			RESERVED_MATTERS,
			REMOVAL_OR_VARIATION_OF_CONDITIONS,
			SOMETHING_ELSE
		}
	}
} = require('@pins/business-rules');

/**
 * @param {boolean} isCASPlanningFeatureFlag
 * @param {boolean} isCASAdvertsFeatureFlag
 * @param {boolean} isAdvertsFeatureFlag
 * @param {string} [typeOfPlanningApplication]
 * @returns {Array<object>} an array of objects representing govuk radio items
 */
exports.typeOfPlanningApplicationRadioItems = (
	isCASPlanningFeatureFlag,
	isCASAdvertsFeatureFlag,
	isAdvertsFeatureFlag,
	typeOfPlanningApplication
) => {
	const items = [
		{
			value: FULL_APPEAL,
			text: 'Full planning',
			attributes: { 'data-cy': 'answer-full-appeal' },
			checked: typeOfPlanningApplication === FULL_APPEAL,
			hint: {
				text: 'Applications affecting flats, more than one house or changes of use. For example, a new building or any commercial project.'
			}
		},
		{
			value: HOUSEHOLDER_PLANNING,
			text: 'Householder planning',
			attributes: { 'data-cy': 'answer-householder-planning' },
			checked: typeOfPlanningApplication === HOUSEHOLDER_PLANNING,
			hint: {
				text: 'A simpler process for changes to a single house, including works within the garden. For example, small projects like extensions, conservatories or loft conversions.'
			}
		},
		{
			value: LISTED_BUILDING,
			text: 'Listed building consent',
			attributes: { 'data-cy': 'answer-listed-building' },
			checked: typeOfPlanningApplication === LISTED_BUILDING,
			hint: {
				text: 'Applications involving a listed building.'
			}
		},
		{
			value: ADVERTISEMENT,
			text: 'Displaying an advertisement',
			attributes: { 'data-cy': 'answer-minor-commercial-advertisment' },
			checked: typeOfPlanningApplication === ADVERTISEMENT
		},
		{
			value: MINOR_COMMERCIAL_DEVELOPMENT,
			text: 'Minor commercial development',
			attributes: { 'data-cy': 'answer-minor-commercial-development' },
			checked: typeOfPlanningApplication === MINOR_COMMERCIAL_DEVELOPMENT,
			hint: {
				text: 'To develop or alter an existing building (or part of a building) for certain commercial purposes.'
			}
		},
		{
			value: OUTLINE_PLANNING,
			text: 'Outline planning',
			attributes: { 'data-cy': 'answer-outline-planning' },
			checked: typeOfPlanningApplication === OUTLINE_PLANNING,
			hint: {
				text: 'General principles of how a site can be developed.'
			}
		},
		{
			value: PRIOR_APPROVAL,
			text: 'Prior approval',
			attributes: { 'data-cy': 'answer-prior-approval' },
			checked: typeOfPlanningApplication === PRIOR_APPROVAL,
			hint: {
				text: 'To accept specific parts of a development before work can start.'
			}
		},
		{
			value: RESERVED_MATTERS,
			text: 'Reserved matters',
			attributes: { 'data-cy': 'answer-reserved-matters' },
			checked: typeOfPlanningApplication === RESERVED_MATTERS,
			hint: {
				text: 'Parts of a proposed development which you chose to not submit with your outline planning application (so they are ‘reserved’ for a later decision).'
			}
		},
		{
			value: REMOVAL_OR_VARIATION_OF_CONDITIONS,
			text: 'Removal or variation of conditions',
			attributes: { 'data-cy': 'answer-removal-or-variation-of-conditions' },
			checked: typeOfPlanningApplication === REMOVAL_OR_VARIATION_OF_CONDITIONS,
			hint: {
				text: 'Planning conditions limit and control the way you must develop.'
			}
		},
		{
			value: SOMETHING_ELSE,
			text: 'Something else',
			attributes: { 'data-cy': 'answer-something-else' },
			checked: typeOfPlanningApplication === SOMETHING_ELSE
		},
		{
			divider: 'or'
		},
		{
			value: I_HAVE_NOT_MADE_A_PLANNING_APPLICATION,
			text: 'I have not made a planning application',
			attributes: { 'data-cy': 'answer-i-have-not-made-a-planning-application' },
			checked: typeOfPlanningApplication === I_HAVE_NOT_MADE_A_PLANNING_APPLICATION
		}
	];

	// only return the minor commercial development option if feature flag turned on
	const casPlanningFiltered = isCASPlanningFeatureFlag
		? items
		: items.filter((item) => item.value !== MINOR_COMMERCIAL_DEVELOPMENT);
	// only return the minor commercial advertisment option if feature flag turned on
	return isAdvertsFeatureFlag || isCASAdvertsFeatureFlag
		? casPlanningFiltered
		: casPlanningFiltered.filter((item) => item.value !== ADVERTISEMENT);
};
