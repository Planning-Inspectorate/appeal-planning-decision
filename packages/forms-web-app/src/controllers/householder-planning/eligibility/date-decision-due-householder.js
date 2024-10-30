const { isValid, parseISO } = require('date-fns');
const { rules, validation } = require('@pins/business-rules');
const logger = require('../../../lib/logger');
const { createOrUpdateAppeal } = require('../../../lib/appeals-api-wrapper');
const {
	VIEW: {
		HOUSEHOLDER_PLANNING: {
			ELIGIBILITY: { DATE_DECISION_DUE_HOUSEHOLDER: currentPage }
		}
	}
} = require('../../../lib/views');
const config = require('../../../config');

const shutterPage = '/before-you-start/you-cannot-appeal';
const enforcementNoticeHouseholder = `/before-you-start/enforcement-notice-householder`;

exports.getDateDecisionDueHouseholder = async (req, res) => {
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

exports.postDateDecisionDueHouseholder = async (req, res) => {
	const { body } = req;
	const { errors = {}, errorSummary = [] } = body;
	const { appeal } = req.session;

	if (Object.keys(errors).length > 0) {
		return res.render(currentPage, {
			bannerHtmlOverride: config.betaBannerText,
			decisionDate: {
				day: body['date-decision-due-householder-day'],
				month: body['date-decision-due-householder-month'],
				year: body['date-decision-due-householder-year']
			},
			errors,
			errorSummary
		});
	}

	const enteredDate = new Date(
		body['date-decision-due-householder-year'],
		(parseInt(body['date-decision-due-householder-month'], 10) - 1).toString(),
		body['date-decision-due-householder-day']
	);

	const deadlineDate = rules.appeal.deadlineDate(
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

		req.session.appeal.eligibility.appealDeadline = deadlineDate;
		req.session.appeal.eligibility.appealPeriod = deadline.description;

		return res.redirect(shutterPage);
	}

	try {
		req.session.appeal = await createOrUpdateAppeal({
			...appeal,
			decisionDate: enteredDate.toISOString()
		});
		return res.redirect(enforcementNoticeHouseholder);
	} catch (e) {
		logger.error(e);

		return res.render(currentPage, {
			bannerHtmlOverride: config.betaBannerText,
			decisionDate: {
				day: body['date-decision-due-householder-day'],
				month: body['date-decision-due-householder-month'],
				year: body['date-decision-due-householder-year']
			},
			errors,
			errorSummary: [{ text: e.toString(), href: 'date-decision-due-householder' }]
		});
	}
};
