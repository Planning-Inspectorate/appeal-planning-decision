const pinsYup = require('../../lib/pins-yup');
const parseDateString = require('../../utils/parse-date-string');
const {
	APPLICATION_DECISION,
	APPEAL_ID,
	APPEAL_STATE,
	TYPE_OF_PLANNING_APPLICATION,
	SECTION_STATE
} = require('../../constants');

const update = pinsYup
	.object()
	.noUnknown(true)
	.shape({
		id: pinsYup.string().uuid().required(),
		horizonId: pinsYup.string().trim().max(20).nullable(),
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
			.noUnknown(true),
		aboutYouSection: pinsYup
			.object()
			.shape({
				yourDetails: pinsYup.object().shape({
					isOriginalApplicant: pinsYup.bool().required(),
					name: pinsYup
						.string()
						.min(2)
						.max(80)
						.matches(/^[a-z\-' ]+$/i)
						.required(),
					appealingOnBehalfOf: pinsYup
						.string()
						.max(80)
						.matches(/^[a-z\-' ]*$/i)
						.nullable()
				})
			})
			.noUnknown(true),
		requiredDocumentsSection: pinsYup
			.object()
			.shape({
				originalApplication: pinsYup
					.object()
					.shape({
						uploadedFile: pinsYup
							.object()
							.shape({
								id: pinsYup.string().trim().uuid().required(),
								name: pinsYup.string().trim().max(255).required(),
								fileName: pinsYup.string().trim().max(255).required(),
								originalFileName: pinsYup.string().trim().max(255).required(),
								location: pinsYup.string().trim().required(),
								size: pinsYup.number().required()
							})
							.noUnknown(true)
					})
					.noUnknown(true),
				decisionLetter: pinsYup
					.object()
					.shape({
						uploadedFile: pinsYup
							.object()
							.shape({
								id: pinsYup.string().trim().uuid().required(),
								name: pinsYup.string().trim().max(255).required(),
								fileName: pinsYup.string().trim().max(255).required(),
								originalFileName: pinsYup.string().trim().max(255).required(),
								location: pinsYup.string().trim().required(),
								size: pinsYup.number().required()
							})
							.noUnknown(true)
					})
					.noUnknown(true)
			})
			.noUnknown(true),
		yourAppealSection: pinsYup.object().shape({
			appealStatement: pinsYup
				.object()
				.shape({
					uploadedFile: pinsYup
						.object()
						.shape({
							id: pinsYup.string().trim().uuid().required(),
							name: pinsYup.string().trim().max(255).required(),
							fileName: pinsYup.string().trim().max(255).required(),
							originalFileName: pinsYup.string().trim().max(255).required(),
							location: pinsYup.string().trim().required(),
							size: pinsYup.number().required()
						})
						.noUnknown(true),
					hasSensitiveInformation: pinsYup.bool().required()
				})
				.noUnknown(true),
			otherDocuments: pinsYup
				.object()
				.shape({
					uploadedFiles: pinsYup.array().of(
						pinsYup
							.object()
							.shape({
								id: pinsYup.string().trim().uuid().nullable(),
								name: pinsYup.string().trim().max(255).nullable(),
								fileName: pinsYup.string().trim().max(255).nullable(),
								originalFileName: pinsYup.string().trim().max(255).nullable(),
								location: pinsYup.string().trim().nullable(),
								size: pinsYup.number().nullable()
							})
							.noUnknown(true)
					)
				})
				.noUnknown(true)
		}),
		appealSubmission: pinsYup.object().shape({
			appealPDFStatement: pinsYup
				.object()
				.shape({
					uploadedFile: pinsYup
						.object()
						.shape({
							id: pinsYup.string().trim().uuid().required(),
							name: pinsYup.string().trim().max(255).required(),
							fileName: pinsYup.string().trim().max(255).required(),
							originalFileName: pinsYup.string().trim().max(255).required(),
							location: pinsYup.string().trim().required(),
							size: pinsYup.number().required()
						})
						.noUnknown(true)
				})
				.noUnknown(true)
		}),
		appealSiteSection: pinsYup.object().shape({
			siteAddress: pinsYup
				.object()
				.shape({
					addressLine1: pinsYup.string().max(60).required(),
					addressLine2: pinsYup.string().max(60).nullable(),
					town: pinsYup.string().max(60).nullable(),
					county: pinsYup.string().max(60).nullable(),
					postcode: pinsYup.string().max(8).required()
				})
				.noUnknown(true),
			siteOwnership: pinsYup
				.object()
				.shape({
					ownsWholeSite: pinsYup.bool().required(),
					haveOtherOwnersBeenTold: pinsYup.bool().nullable()
				})
				.noUnknown(true),
			siteAccess: pinsYup
				.object()
				.shape({
					canInspectorSeeWholeSiteFromPublicRoad: pinsYup.bool().required(),
					howIsSiteAccessRestricted: pinsYup.string().max(1000).nullable()
				})
				.noUnknown(true),
			healthAndSafety: pinsYup
				.object()
				.shape({
					hasIssues: pinsYup.bool().required(),
					healthAndSafetyIssues: pinsYup.string().max(1000).nullable()
				})
				.noUnknown(true)
		}),
		sectionStates: pinsYup.object().shape({
			aboutYouSection: pinsYup
				.object()
				.shape({
					yourDetails: pinsYup.string().oneOf(Object.values(SECTION_STATE)).required()
				})
				.noUnknown(true),
			requiredDocumentsSection: pinsYup
				.object()
				.shape({
					originalApplication: pinsYup.string().oneOf(Object.values(SECTION_STATE)).required(),
					decisionLetter: pinsYup.string().oneOf(Object.values(SECTION_STATE)).required()
				})
				.noUnknown(true),
			yourAppealSection: pinsYup
				.object()
				.shape({
					appealStatement: pinsYup.string().oneOf(Object.values(SECTION_STATE)).required(),
					otherDocuments: pinsYup.string().oneOf(Object.values(SECTION_STATE)).required()
				})
				.noUnknown(true),
			appealSiteSection: pinsYup
				.object()
				.shape({
					siteAddress: pinsYup.string().oneOf(Object.values(SECTION_STATE)).required(),
					siteAccess: pinsYup.string().oneOf(Object.values(SECTION_STATE)).required(),
					siteOwnership: pinsYup.string().oneOf(Object.values(SECTION_STATE)).required(),
					healthAndSafety: pinsYup.string().oneOf(Object.values(SECTION_STATE)).required()
				})
				.noUnknown(true)
		})
	});

module.exports = update;
