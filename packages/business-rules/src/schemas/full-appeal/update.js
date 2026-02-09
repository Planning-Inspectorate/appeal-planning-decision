const pinsYup = require('../../lib/pins-yup');
const parseDateString = require('../../utils/parse-date-string');
const {
	APPEAL_ID,
	APPEAL_STATE,
	APPLICATION_ABOUT,
	APPLICATION_CATEGORIES,
	APPLICATION_DECISION,
	TYPE_OF_PLANNING_APPLICATION
} = require('../../constants');

const update = pinsYup
	.object()

	.shape({
		id: pinsYup.string().trim().uuid().required(),
		lpaCode: pinsYup.string().trim().max(20).required(),
		planningApplicationNumber: pinsYup.string().max(30).required(),
		decisionDate: pinsYup.lazy((decisionDate) => {
			return pinsYup
				.date()
				.isInThePast(decisionDate)
				.isWithinDeadlinePeriod(decisionDate)
				.transform(parseDateString)
				.required();
		}),
		createdAt: pinsYup.date().transform(parseDateString).required(),
		updatedAt: pinsYup.date().transform(parseDateString).required(),
		submissionDate: pinsYup.date().transform(parseDateString).nullable(),
		state: pinsYup.string().oneOf(Object.values(APPEAL_STATE)).required(),
		appealType: pinsYup.string().oneOf(Object.values(APPEAL_ID)).required(),
		typeOfPlanningApplication: pinsYup
			.string()
			.oneOf(Object.values(TYPE_OF_PLANNING_APPLICATION))
			.required(),
		email: pinsYup.string().email().max(255).required(),
		eligibility: pinsYup.object().shape({
			applicationCategories: pinsYup
				.array()
				.allOfSelectedOptions('applicationCategories', [APPLICATION_CATEGORIES.NON_OF_THESE])
				.required(),
			applicationDecision: pinsYup.string().oneOf(Object.values(APPLICATION_DECISION)).required(),
			enforcementNotice: pinsYup.bool().required(),
			hasPriorApprovalForExistingHome: pinsYup.bool().nullable(),
			hasHouseholderPermissionConditions: pinsYup.bool().nullable(),
			isListedBuilding: pinsYup.bool().nullable(),
			planningApplicationAbout: pinsYup
				.array()
				.nullable()
				.maybeOption('planningApplicationAbout', Object.values(APPLICATION_ABOUT))
		})
	});

module.exports = update;
