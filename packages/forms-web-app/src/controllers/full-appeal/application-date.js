const { createOrUpdateAppeal } = require('#lib/appeals-api-wrapper');
const {
	VIEW: {
		FULL_APPEAL: { APPLICATION_DATE: currentPage }
	}
} = require('#lib/views');
const { parseISO, isValid } = require('date-fns');
const logger = require('#lib/logger');
const { TYPE_OF_PLANNING_APPLICATION, APPEAL_ID } = require('@pins/business-rules/src/constants');
const { isExpeditedAppealDate } = require('#lib/is-expedited-part1-eligible');
const { APPLICATION_DECISION } = require('@pins/business-rules/src/constants');

const getApplicationDate = async (req, res) => {
	const { appeal } = req.session;

	const appealApplicationDate = parseISO(appeal.applicationDate);
	const applicationDate = isValid(appealApplicationDate) ? appealApplicationDate : null;

	res.render(currentPage, {
		applicationDate: applicationDate && {
			day: applicationDate.getDate().toString().padStart(2, '0'),
			month: (applicationDate?.getMonth() + 1).toString().padStart(2, '0'),
			year: String(applicationDate?.getFullYear())
		}
	});
};

const postApplicationDate = async (req, res) => {
	const { body } = req;
	const { errors = {}, errorSummary = [] } = body;
	const { appeal } = req.session;

	if (Object.keys(errors).length > 0) {
		return res.render(currentPage, {
			applicationDate: {
				day: body['application-date-day'],
				month: body['application-date-month'],
				year: body['application-date-year']
			},
			errors,
			errorSummary
		});
	}

	try {
		const enteredDate = new Date(
			body['application-date-year'],
			(parseInt(body['application-date-month'], 10) - 1).toString(),
			body['application-date-day']
		);

		appeal.applicationDate = enteredDate.toISOString();

		const isPriorApproval =
			appeal.typeOfPlanningApplication === TYPE_OF_PLANNING_APPLICATION.PRIOR_APPROVAL;
		const isVariationOfConditions =
			appeal.typeOfPlanningApplication ===
				TYPE_OF_PLANNING_APPLICATION.REMOVAL_OR_VARIATION_OF_CONDITIONS &&
			isExpeditedAppealDate(appeal.applicationDate);

		if (isPriorApproval || isVariationOfConditions) {
			const isHouseholderEligible = isPriorApproval
				? appeal.eligibility?.hasPriorApprovalForExistingHome
				: appeal.eligibility?.hasHouseholderPermissionConditions &&
					appeal.eligibility?.applicationDecision === APPLICATION_DECISION.REFUSED;

			if (isHouseholderEligible) {
				appeal.appealType = APPEAL_ID.HOUSEHOLDER;
				appeal.appealSiteSection.siteOwnership = {
					ownsWholeSite: null,
					haveOtherOwnersBeenTold: null
				};
			} else {
				appeal.appealType = APPEAL_ID.PLANNING_SECTION_78;
				appeal.appealSiteSection.siteOwnership = {
					ownsSomeOfTheLand: null,
					ownsAllTheLand: null,
					knowsTheOwners: null,
					hasIdentifiedTheOwners: null,
					tellingTheLandowners: null,
					advertisingYourAppeal: null
				};
			}
		}

		req.session.appeal = await createOrUpdateAppeal(appeal);

		if (appeal.appealType === APPEAL_ID.MINOR_COMMERCIAL_ADVERTISEMENT) {
			return res.redirect('/before-you-start/decision-date');
		}

		if (appeal.typeOfPlanningApplication === TYPE_OF_PLANNING_APPLICATION.HOUSEHOLDER_PLANNING) {
			return res.redirect('/before-you-start/granted-or-refused-householder');
		}
		if (
			appeal.typeOfPlanningApplication === TYPE_OF_PLANNING_APPLICATION.PRIOR_APPROVAL &&
			appeal.eligibility?.hasPriorApprovalForExistingHome
		) {
			if (appeal.appealType === APPEAL_ID.PLANNING_SECTION_78) {
				return res.redirect('/before-you-start/granted-or-refused');
			}
			return res.redirect('/before-you-start/granted-or-refused-householder');
		}

		if (
			appeal.typeOfPlanningApplication ===
			TYPE_OF_PLANNING_APPLICATION.REMOVAL_OR_VARIATION_OF_CONDITIONS
		) {
			if (isExpeditedAppealDate(appeal.applicationDate)) {
				if (appeal.appealType === APPEAL_ID.PLANNING_SECTION_78) {
					return res.redirect('/before-you-start/granted-or-refused');
				}
				return res.redirect('/before-you-start/granted-or-refused-householder');
			}
			if (appeal.eligibility?.hasHouseholderPermissionConditions) {
				return res.redirect('/before-you-start/granted-or-refused-householder');
			}
			return res.redirect('/before-you-start/granted-or-refused');
		}

		if (
			appeal.typeOfPlanningApplication === TYPE_OF_PLANNING_APPLICATION.MINOR_COMMERCIAL_DEVELOPMENT
		) {
			return res.redirect('/before-you-start/granted-or-refused');
		}

		return res.redirect(`/before-you-start/granted-or-refused`);
	} catch (e) {
		logger.error(e);

		return res.render(currentPage, {
			appeal,
			errors,
			errorSummary: [{ text: e.toString(), href: 'application-date' }]
		});
	}
};

module.exports = { getApplicationDate, postApplicationDate };
