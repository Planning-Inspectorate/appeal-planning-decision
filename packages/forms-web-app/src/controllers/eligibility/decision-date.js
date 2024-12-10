const { isValid, parseISO } = require('date-fns');
const { rules, validation } = require('@pins/business-rules');
const { createOrUpdateAppeal } = require('../../lib/appeals-api-wrapper');
const logger = require('../../lib/logger');
const { VIEW } = require('../../lib/views');
const config = require('../../config');

exports.getDecisionDate = (req, res) => {
	const { appeal } = req.session;

	const appealDecisionDate = parseISO(appeal.decisionDate);
	const decisionDate = isValid(appealDecisionDate) ? appealDecisionDate : null;

	res.render(VIEW.ELIGIBILITY.DECISION_DATE, {
		bannerHtmlOverride: config.betaBannerText,
		decisionDate: decisionDate && {
			day: `0${decisionDate.getDate()}`.slice(-2),
			month: `0${decisionDate.getMonth() + 1}`.slice(-2),
			year: decisionDate.getFullYear()
		}
	});
};

exports.postDecisionDate = async (req, res) => {
	const { body } = req;
	/* istanbul ignore next */
	const { appeal } = req.session;
	const { errors = {}, errorSummary = [] } = body;

	if (Object.keys(errors).length > 0) {
		res.render(VIEW.ELIGIBILITY.DECISION_DATE, {
			bannerHtmlOverride: config.betaBannerText,
			decisionDate: {
				day: body['decision-date-day'],
				month: body['decision-date-month'],
				year: body['decision-date-year']
			},
			errors,
			errorSummary
		});
		return;
	}

	const decisionDate = body['decision-date'];
	appeal.decisionDate = new Date(`${decisionDate}T12:00:00.000Z`);

	try {
		req.session.appeal = await createOrUpdateAppeal(appeal);
	} catch (e) {
		logger.error(e);

		res.render(VIEW.ELIGIBILITY.DECISION_DATE, {
			bannerHtmlOverride: config.betaBannerText,
			appeal,
			errors,
			errorSummary: [{ text: e.toString(), href: '#' }]
		});
		return;
	}

	const isWithinExpiryPeriod = validation.appeal.decisionDate.isWithinDecisionDateExpiryPeriod(
		appeal.decisionDate
	);

	const redirectTo = isWithinExpiryPeriod
		? `/${VIEW.ELIGIBILITY.PLANNING_DEPARTMENT}`
		: `/${VIEW.ELIGIBILITY.DECISION_DATE_PASSED}`;

	res.redirect(redirectTo);
};

exports.getDecisionDatePassed = (req, res) => {
	const { appeal } = req.session;

	res.render(VIEW.ELIGIBILITY.DECISION_DATE_PASSED, {
		bannerHtmlOverride: config.betaBannerText,
		deadlineDate: appeal.decisionDate && rules.appeal.deadlineDate(parseISO(appeal.decisionDate))
	});
};
