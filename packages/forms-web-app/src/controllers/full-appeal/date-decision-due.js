const { isValid, parseISO } = require('date-fns');
const { rules, validation } = require('@pins/business-rules');
const { createOrUpdateAppeal } = require('../../lib/appeals-api-wrapper');
const logger = require('../../lib/logger');
const {
	VIEW: {
		FULL_APPEAL: { DATE_DECISION_DUE: currentPage }
	}
} = require('../../lib/views');

const navigationPage = {
	nextPage: '/before-you-start/can-use-service',
	shutterPage: '/before-you-start/you-cannot-appeal'
};

exports.getDateDecisionDue = (req, res) => {
	const { appeal } = req.session;

	const appealDecisionDate = parseISO(appeal.decisionDate);
	const decisionDate = isValid(appealDecisionDate) ? appealDecisionDate : null;

	res.render(currentPage, {
		decisionDate: decisionDate && {
			day: `0${decisionDate?.getDate()}`.slice(-2),
			month: `0${decisionDate?.getMonth() + 1}`.slice(-2),
			year: decisionDate?.getFullYear()
		}
	});
};

const filteredErrorSummary = (errorSummary) => {
	if (!errorSummary || errorSummary.length <= 1) return errorSummary;

	const filteredErrors = [];
	const texts = ['must include a'];
	// Remove single date error if compound ones are present
	const filtered = errorSummary.filter((e) => !e.text.includes(texts));

	// Return first compound errors, if exists or return first of any error
	if (filtered.length === 0) {
		filteredErrors.push(errorSummary[0]);
	} else {
		filteredErrors.push(filtered[0]);
	}

	return filteredErrors;
};

exports.postDateDecisionDue = async (req, res) => {
	const { body } = req;
	/* istanbul ignore next */
	const { appeal } = req.session;
	const { errors = {}, errorSummary = [] } = body;

	if (Object.keys(errors).length > 0) {
		res.render(currentPage, {
			decisionDate: {
				day: body['decision-date-day'],
				month: body['decision-date-month'],
				year: body['decision-date-year']
			},
			errors,
			errorSummary: filteredErrorSummary(errorSummary)
		});
		return;
	}

	const decisionDate = body['decision-date'];

	appeal.decisionDate = new Date(`${decisionDate}T12:00:00.000Z`);

	try {
		req.session.appeal = await createOrUpdateAppeal(appeal);
	} catch (e) {
		logger.error(e);

		res.render(currentPage, {
			decisionDate: {
				day: body['decision-date-day'],
				month: body['decision-date-month'],
				year: body['decision-date-year']
			},
			errors,
			errorSummary: [{ text: e.toString(), href: '#' }]
		});
		return;
	}

	const isWithinExpiryPeriod = validation.appeal.decisionDate.isWithinDecisionDateExpiryPeriod(
		appeal.decisionDate,
		appeal.appealType,
		appeal.eligibility.applicationDecision
	);

	const redirectTo = isWithinExpiryPeriod ? navigationPage.nextPage : navigationPage.shutterPage;
	const deadlinePeriod = rules.appeal.deadlinePeriod(
		appeal.appealType,
		appeal.eligibility.applicationDecision
	);

	req.session.appeal.eligibility.appealDeadline =
		decisionDate &&
		rules.appeal.deadlineDate(
			parseISO(decisionDate),
			appeal.appealType,
			appeal.eligibility.applicationDecision
		);

	req.session.appeal.eligibility.appealPeriod = deadlinePeriod.description;
	res.redirect(redirectTo);
};
