const pinsYup = require('../../lib/pins-yup');
const parseDateString = require('../../utils/parse-date-string');
const {
	APPLICATION_DECISION,
	APPEAL_ID,
	APPEAL_STATE,
	TYPE_OF_PLANNING_APPLICATION
} = require('../../constants');

const update = pinsYup
	.object()
	.noUnknown(true)
	.shape({
		id: pinsYup.string().uuid().required(),
		lpaCode: pinsYup.string().trim().max(20).required(),
		planningApplicationNumber: pinsYup.string().max(30).required(),
		appealType: pinsYup.lazy((appealType) => {
			if (appealType) {
				return pinsYup.string().oneOf(Object.values(APPEAL_ID));
			}
			return pinsYup.string().nullable();
		}),
		typeOfPlanningApplication: pinsYup.lazy((typeOfPlanningApplication) => {
			if (typeOfPlanningApplication) {
				return pinsYup.string().oneOf(Object.values(TYPE_OF_PLANNING_APPLICATION));
			}
			return pinsYup.string().nullable();
		}),
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
		email: pinsYup.string().email().max(255).required(),
		hideFromDashboard: pinsYup.bool().nullable(),
		eligibility: pinsYup
			.object()
			.shape({
				applicationDecision: pinsYup
					.mixed()
					.test(
						'applicationDecision',
						`eligibility.applicationDecision must be one of the following values: ${Object.values(
							APPLICATION_DECISION
						).join(', ')}`,
						function test(applicationDecision) {
							if (applicationDecision) {
								return pinsYup
									.string()
									.oneOf(Object.values(APPLICATION_DECISION))
									.isValidSync(applicationDecision);
							}
							if (this.options.parent.householderPlanningPermission) {
								return pinsYup
									.bool()
									.required()
									.isValidSync(this.options.parent.householderPlanningPermission);
							}
							return false;
						}
					),
				enforcementNotice: pinsYup.bool().required(),
				householderPlanningPermission: pinsYup.bool().nullable(),
				isClaimingCosts: pinsYup.bool().required(),
				isListedBuilding: pinsYup.bool().required(),
				hasPriorApprovalForExistingHome: pinsYup.bool().nullable(),
				hasHouseholderPermissionConditions: pinsYup.bool().nullable()
			})
			.noUnknown(true)
	});

module.exports = update;
