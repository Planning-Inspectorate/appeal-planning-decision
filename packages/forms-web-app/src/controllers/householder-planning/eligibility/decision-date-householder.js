const { isValid, parseISO } = require('date-fns');
const { rules, validation } = require('@pins/business-rules');

const logger = require('../../../lib/logger');
const { createOrUpdateAppeal } = require('../../../lib/appeals-api-wrapper');
const {
	VIEW: {
		HOUSEHOLDER_PLANNING: {
			ELIGIBILITY: { DECISION_DATE_HOUSEHOLDER: currentPage }
		}
	}
} = require('../../../lib/views');
const config = require('../../../config');
const { isLpaInFeatureFlag } = require('#lib/is-lpa-in-feature-flag');
const { FLAG } = require('@pins/common/src/feature-flags');

exports.getDecisionDateHouseholder = async (req, res) => {
	const { appeal } = req.session;

	const appealDecisionDate = parseISO(appeal.decisionDate);
	const decisionDate = isValid(appealDecisionDate) ? appealDecisionDate : null;

	res.render(currentPage, {
		bannerHtmlOverride: config.betaBannerText,
		decisionDate: decisionDate && {
			day: `0${decisionDate?.getDate()}`.slice(-2),
			month: `0${decisionDate?.getMonth() + 1}`.slice(-2),
			year: String(decisionDate?.getFullYear())
		}
	});
};

exports.postDecisionDateHouseholder = async (req, res) => {
	const { body } = req;
	const { errors = {}, errorSummary = [] } = body;
	const { appeal } = req.session;

	if (Object.keys(errors).length > 0) {
		return res.render(currentPage, {
			bannerHtmlOverride: config.betaBannerText,
			decisionDate: {
				day: body['decision-date-householder-day'],
				month: body['decision-date-householder-month'],
				year: body['decision-date-householder-year']
			},
			errors,
			errorSummary
		});
	}

	const enteredDate = new Date(
		body['decision-date-householder-year'],
		(parseInt(body['decision-date-householder-month'], 10) - 1).toString(),
		body['decision-date-householder-day']
	);

	const refusedDeadlineDate = rules.appeal.deadlineDate(
		enteredDate,
		appeal.appealType,
		appeal.eligibility.applicationDecision
	);

	const isWithinExpiryPeriod = validation.appeal.decisionDate.isWithinDecisionDateExpiryPeriod(
		enteredDate,
		appeal.appealType,
		appeal.eligibility.applicationDecision
	);

	if (!isWithinExpiryPeriod) {
		const deadline = rules.appeal.deadlinePeriod(
			appeal.appealType,
			appeal.eligibility.applicationDecision
		);
		req.session.appeal.eligibility.appealDeadline = refusedDeadlineDate;
		req.session.appeal.eligibility.appealPeriod = deadline.description;

		return res.redirect(`/before-you-start/you-cannot-appeal`);
	}

	const usingV2Form = await isLpaInFeatureFlag(appeal.lpaCode, FLAG.HAS_APPEAL_FORM_V2);

	const nextPage = usingV2Form
		? '/before-you-start/can-use-service'
		: '/before-you-start/claiming-costs-householder';

	try {
		req.session.appeal = await createOrUpdateAppeal({
			...appeal,
			decisionDate: enteredDate.toISOString()
		});
		return res.redirect(nextPage);
	} catch (e) {
		logger.error(e);

		return res.render(currentPage, {
			bannerHtmlOverride: config.betaBannerText,
			appeal,
			errors,
			errorSummary: [{ text: e.toString(), href: 'decision-date-householder' }]
		});
	}
};
