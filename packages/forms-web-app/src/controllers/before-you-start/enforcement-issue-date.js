const logger = require('../../lib/logger');
const { createOrUpdateAppeal } = require('../../lib/appeals-api-wrapper');
const {
	VIEW: {
		BEFORE_YOU_START: { ENFORCEMENT_ISSUE_DATE }
	}
} = require('../../lib/views');
const { getExampleDate } = require('../../dynamic-forms/questions-utils');
const { parseISO, isValid } = require('date-fns');

exports.getEnforcementIssueDate = (req, res) => {
	const { appeal } = req.session;

	const enforcementIssueDate = parseISO(appeal.eligibility?.enforcementIssueDate);
	const issueDate = isValid(enforcementIssueDate) ? enforcementIssueDate : null;

	res.render(ENFORCEMENT_ISSUE_DATE, {
		enforcementIssueDate: issueDate && {
			day: `0${issueDate?.getDate()}`.slice(-2),
			month: `0${issueDate?.getMonth() + 1}`.slice(-2),
			year: String(issueDate?.getFullYear())
		},
		hint: {
			enforcementIssueDate: `For example ${getExampleDate('past', 27)}`
		}
	});
};

exports.postEnforcementIssueDate = async (req, res) => {
	const { body } = req;
	const { errors = {}, errorSummary = [] } = body;
	const { appeal } = req.session;

	if (Object.keys(errors).length > 0) {
		res.render(ENFORCEMENT_ISSUE_DATE, {
			enforcementIssueDate: {
				day: body['enforcement-issue-date-day'],
				month: body['enforcement-issue-date-month'],
				year: body['enforcement-issue-date-year']
			},
			hint: {
				enforcementIssueDate: `For example ${getExampleDate('past', 14)}`
			},
			errors,
			errorSummary,
			focusErrorSummary: !!errors
		});
		return;
	}

	const enforcementIssueDate = new Date(body['enforcement-issue-date']);

	try {
		req.session.appeal = await createOrUpdateAppeal({
			...appeal,
			eligibility: {
				...appeal.eligibility,
				enforcementIssueDate: enforcementIssueDate.toISOString()
			}
		});
	} catch (e) {
		logger.error(e);

		res.render(ENFORCEMENT_ISSUE_DATE, {
			appeal,
			errors,
			errorSummary: [{ text: e.toString(), href: '#' }]
		});
		return;
	}

	res.redirect('/before-you-start/enforcement-effective-date');
};
