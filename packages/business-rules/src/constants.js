const APPEAL_ID = {
	ENFORCEMENT_NOTICE: '1000',
	HOUSEHOLDER: '1001',
	ENFORCEMENT_LISTED_BUILDING: '1002',
	ADVERTISEMENT: '1003',
	PLANNING_OBLIGATION: '1004',
	PLANNING_SECTION_78: '1005',
	PLANNING_LISTED_BUILDING: '1006',
	MINOR_COMMERCIAL_ADVERTISEMENT: '1007',
	MINOR_COMMERCIAL: '1008',
	HEDGEROW: '1009',
	HIGH_HEDGES: '1010',
	FAST_TRACK_TREES: '1011'
};

const APPEAL_STATE = {
	DRAFT: 'DRAFT',
	SUBMITTED: 'SUBMITTED'
};

const PROCEDURE_TYPE = {
	WRITTEN_REPRESENTATION: 'Written Representation',
	HEARING: 'Hearing',
	INQUIRY: 'Inquiry'
};

const SECTION_STATE = {
	NOT_STARTED: 'NOT STARTED',
	IN_PROGRESS: 'IN PROGRESS',
	COMPLETED: 'COMPLETED'
};

const TYPE_OF_PLANNING_APPLICATION = {
	FULL_APPEAL: 'full-appeal',
	HOUSEHOLDER_PLANNING: 'householder-planning',
	LISTED_BUILDING: 'listed-building',
	OUTLINE_PLANNING: 'outline-planning',
	PRIOR_APPROVAL: 'prior-approval',
	RESERVED_MATTERS: 'reserved-matters',
	REMOVAL_OR_VARIATION_OF_CONDITIONS: 'removal-or-variation-of-conditions',
	MINOR_COMMERCIAL_DEVELOPMENT: 'minor-commercial-development',
	MINOR_COMMERCIAL_ADVERTISEMENT: 'minor-commercial-advertisement',
	SOMETHING_ELSE: 'something-else',
	I_HAVE_NOT_MADE_A_PLANNING_APPLICATION: 'i-have-not-made-a-planning-application'
};

const APPLICATION_DECISION = {
	GRANTED: 'granted',
	REFUSED: 'refused',
	NODECISIONRECEIVED: 'nodecisionreceived'
};

const APPLICATION_CATEGORIES = {
	LISTED_BUILDING: 'a_listed_building',
	MAJOR_DWELLINGS: 'major_dwellings',
	MAJOR_GENERAL_INDUSTRY_STORAGE_WAREHOUSING: 'major_general_industry_storage_warehousing',
	MAJOR_RATAIL_AND_SERVICES: 'major_retail_and_services',
	MAJOR_TRAVELLING_AND_CARAVAN_PITCHES: 'major_travelling_and_caravan_pitches',
	NON_OF_THESE: 'none_of_these'
};

const APPLICATION_ABOUT = {
	CHANGE_OF_USE: 'change_of_use',
	CHANGE_NUMBER_UNITS: 'change_units_in_building',
	NOT_WHOLLY_GROUND_FLOOR: 'not_wholly_ground_floor',
	GROSS_INTERNAL_AREA: 'gross_internal_area',
	NON_OF_THESE: 'none_of_these'
};

const APPLICATION_ABOUT_LABELS = {
	[APPLICATION_ABOUT.CHANGE_OF_USE]: 'Change of use',
	[APPLICATION_ABOUT.CHANGE_NUMBER_UNITS]: 'A change to the number of units in a building',
	[APPLICATION_ABOUT.NOT_WHOLLY_GROUND_FLOOR]:
		'Development that is not wholly at ground floor level',
	[APPLICATION_ABOUT.GROSS_INTERNAL_AREA]:
		'Development that would increase the gross internal area of a building',
	[APPLICATION_ABOUT.NON_OF_THESE]: 'None of these'
};

const KNOW_THE_OWNERS = {
	YES: 'yes',
	SOME: 'some',
	NO: 'no'
};

const PLANNING_OBLIGATION_STATUS_OPTION = {
	FINALISED: 'finalised',
	DRAFT: 'draft',
	NOT_STARTED: 'not_started'
};

const I_AGREE = 'i-agree';

const STANDARD_TRIPLE_CONFIRM_OPTIONS = [
	'toldAboutMyAppeal',
	'withinLast21Days',
	'useCopyOfTheForm'
];

const NEW_OR_SAVED_APPEAL_OPTION = {
	START_NEW: 'start-new',
	RETURN: 'return'
};

module.exports = {
	APPEAL_ID,
	APPEAL_STATE,
	APPLICATION_ABOUT,
	APPLICATION_ABOUT_LABELS,
	APPLICATION_DECISION,
	APPLICATION_CATEGORIES,
	KNOW_THE_OWNERS,
	PLANNING_OBLIGATION_STATUS_OPTION,
	PROCEDURE_TYPE,
	SECTION_STATE,
	TYPE_OF_PLANNING_APPLICATION,
	I_AGREE,
	STANDARD_TRIPLE_CONFIRM_OPTIONS,
	NEW_OR_SAVED_APPEAL_OPTION
};
